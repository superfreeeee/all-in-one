import {
  Form,
  FormPathPattern,
  GeneralField,
  createForm,
  isField,
  onFieldInit,
  onFieldReact,
  onFormInit,
  onFormMount,
  onFormValuesChange,
} from '@formily/core';
import { logGroup } from '../utils/log';
import { cloneDeep } from 'lodash-es';

export const formEffectsExamples = () => {
  syncExample();
  asyncExample();
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
    logGroup(`onFieldInit: path=${field.path.toString()}`, () => {
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
    'syncExample',
    () => {
      const form = createForm({
        effects(form) {
          console.log('set form effects', form);

          onFormInitFactory();
          onFormMountFactory();
          onFormValuesChangeFactory();
          onFieldInitFactory('input');
          onFieldInitFactory('other');

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

      const inputField = form.createField({
        name: 'input',
        initialValue: 'inputVal',
      });

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
    true,
  );
};

/**
 * 异步设置 effects
 */
const asyncExample = () => {
  logGroup('asyncExample', () => {
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
  });
};
