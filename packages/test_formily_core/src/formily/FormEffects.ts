import {
  Form,
  FormPathPattern,
  GeneralField,
  createForm,
  isField,
  onFieldChange,
  onFieldInit,
  onFieldInputValueChange,
  onFieldReact,
  onFieldValueChange,
  onFormInit,
  onFormInputChange,
  onFormMount,
  onFormSubmit,
  onFormSubmitEnd,
  onFormSubmitStart,
  onFormValuesChange,
} from '@formily/core';
import { logGroup } from '../utils/log';
import { cloneDeep } from 'lodash-es';

export const formEffectsExamples = () => {
  // syncExample();
  asyncExample();
  effectSeqenceExample();
};

const onFormInitFactory = () => {
  onFormInit((form) => {
    logGroup('onFormInit', () => {
      console.log('form  :', form);
      printFormLifecycleState(form);
    });
  });
};

const onFormMountFactory = () => {
  onFormMount((form) => {
    logGroup('onFormMount', () => {
      console.log('form  :', form);
      printFormLifecycleState(form);
    });
  });
};

const onFormValuesChangeFactory = () => {
  onFormValuesChange((form) => {
    logGroup('onFormValuesChange', () => {
      console.log('form    :', form);
      console.log('values  :', form.values);
      console.log('raw values  :', cloneDeep(form.values));
    });
  });
};

const onFieldInitFactory = (pattern: FormPathPattern) => {
  onFieldInit(pattern, (field) => {
    logGroup(`onFieldInit, pattern=${pattern}, path=${field.path.toString()}`, () => {
      console.log('field  :', field);
      printFieldLifecycleState(field);
      printFieldValue(field);
    });
  });
};

const printFormLifecycleState = (form: Form) => {
  console.log('initialized  :', form.initialized);
  console.log('mounted      :', form.mounted);
};

const printFieldLifecycleState = (field: GeneralField) => {
  console.log('initialized  :', field.initialized);
  console.log('mounted      :', field.mounted);
};

const printFieldValue = (field: GeneralField) => {
  console.log('data   :', field.data);
  console.log('value  :', isField(field) ? field.value : '<GeneralField>');
};

/**
 * 同步设置 effects
 */
const syncExample = () => {
  logGroup(
    'formEffectsExamples syncExample',
    () => {
      const form = createForm({
        effects(form) {
          console.log('set form effects', form);

          onFormInitFactory();
          onFormMountFactory();
          onFormValuesChangeFactory();
          onFieldInitFactory('input');
          onFieldInitFactory('other');
          onFieldInitFactory('*');

          /**
           * input 的 onInit, onMount 事件都会触发
           * other 的 onInit, onMount 也会触发
           */
          onFieldReact('input', (field, form) => {
            logGroup(`onFieldReact: path=${field.path.toString()}`, () => {
              console.log('field  :', field);
              printFieldLifecycleState(field);
              printFieldValue(field);
            });
            const inputField = isField(field) ? field : undefined;
            if (!inputField) {
              return;
            }

            const otherField = form
              .query('other')
              .take((field) => (isField(field) ? field : undefined));

            if (otherField?.mounted) {
              inputField.value = 'other.mounted';
            }
          });
        },
      });

      console.log('> form.createField: input');
      const inputField = form.createField({
        name: 'input',
        initialValue: 'inputVal',
      });

      console.log('> form.createField: other');
      const otherField = form.createField({
        name: 'other',
        initialValue: 'otherVal',
      });

      console.log('> form.onMount');
      form.onMount();

      console.log('> inputField.onMount');
      inputField.onMount();

      console.log('> otherField.onMount');
      otherField.onMount();

      // console.log('> field.onValueChange');
      // inputField.value += 1;
    },
    // true,
  );
};

/**
 * 异步设置 effects
 */
const asyncExample = () => {
  logGroup('formEffectsExamples asyncExample', () => {
    const form = createForm();

    const inputField = form.createField({
      name: 'input',
      initialValue: 'inputVal',
    });

    const otherField = form.createField({
      name: 'other',
      initialValue: 'otherVal',
    });

    form.addEffects(0, () => {
      onFormInitFactory();
      onFormMountFactory();
      onFormValuesChangeFactory();
      onFieldInitFactory('input');
      onFieldInitFactory('other');
    });

    console.log('form  :', form);
    printFormLifecycleState(form);
    form.onInit();

    // form.onMount();
  });
};

/**
 * 观察 formily 钩子顺序
 */
const effectSeqenceExample = () => {
  logGroup('formEffectsExamples effectSeqenceExample', async () => {
    const form = createForm();

    /**
     * createForm 之后已经是 initialized 状态
     * 异步增加 onFormInit，需要主动重新触发 onInit
     */
    console.log('form.initialized:', form.initialized);

    /**
     * 使用 addEffects 添加依赖
     */
    console.log('> form.addEffects');
    form.addEffects('lifecycle', (form) => {
      // ===== form effects =====
      /**
       * createForm 后直接触发
       */
      onFormInit((_) => {
        console.log('onFormInit, form');
      });

      onFormMount((_) => {
        console.log('onFormMount, form');
      });

      onFormValuesChange((_) => {
        console.log('onFormValuesChange, form');
      });

      onFormInputChange((_) => {
        console.log('onFormInputChange, form');
      });

      onFormSubmitStart((_) => {
        console.log('onFormSubmitStart, form');
      });

      onFormSubmitEnd((_) => {
        console.log('onFormSubmitEnd, form');
      });

      onFormSubmit((_) => {
        console.log('onFormSubmit, form');
      });
      // ===== field effects =====

      onFieldChange('aaa', (field) => {
        console.log(
          'onFieldChange, pattern=aaa, field',
          field,
          isField(field) ? `value=${field.value}` : '',
        );
      });

      onFieldValueChange('aaa', (field) => {
        console.log(
          'onFieldValueChange, pattern=aaa, field',
          field,
          isField(field) ? `value=${field.value}` : '',
        );
      });

      onFieldInputValueChange('aaa', (field) => {
        console.log(
          'onFieldInputValueChange, pattern=aaa, field',
          field,
          isField(field) ? `value=${field.value}` : '',
        );
      });
    });

    console.log('> form.onInit');
    form.onInit();

    console.log('> form.onMount');
    form.onMount();

    console.log('> form.createField: aaa');
    const aField = form.createField({
      name: 'aaa',
      // 带 initialValue 时会触发 onFormValuesChange
      initialValue: 'test aaa',
    });

    console.log('> aField value change');
    /**
     * 使用赋值或是 setValue 修改值
     * 触发 hook
     *   formChange
     *   fieldValueChange
     *   fieldChange
     */
    // aField.value = 'aaa v2';
    aField.setValue('aaa v3');
    // aField.inputValue = 'aaa v2';

    console.log('> form.submit');
    const values = await form.submit();
    console.log('values', values);
  });
};
