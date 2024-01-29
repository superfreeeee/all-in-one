import {
  FormPathPattern,
  GeneralField,
  LifeCycleTypes,
  createForm,
  isField,
  onFieldInit,
  onFieldReact,
  onFormInit,
  onFormMount,
  onFormValuesChange,
} from '@formily/core';
import { logGroup } from '../utils/log';

export const tmpExamples = () => {
  const onFormInitFactory = () => {
    onFormInit((form) => {
      console.log('onFormInit', form);
    });
  };

  const onFormMountFactory = () => {
    onFormMount((form) => {
      console.log('onFormMount', form);
    });
  };

  const onFormValuesChangeFactory = () => {
    onFormValuesChange((form) => {
      console.log('onFormValuesChange', form);
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

  logGroup('tmpExamples', () => {
    const form = createForm({
      effects(form) {
        console.log('set form effects', form);

        onFormInitFactory();
        onFormMountFactory();
        onFormValuesChangeFactory();
        onFieldInitFactory('input');
        onFieldInitFactory('other');

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

    // console.log('> form.onMount');
    // form.onMount();

    console.log('> inputField.onMount');
    inputField.onMount();

    console.log('> otherField.onMount');
    otherField.onMount();

    // console.log('> field.onValueChange');
    // inputField.value += 1;
  });
};

const printFieldLifecycleState = (field: GeneralField) => {
  console.log('initialized  :', field.initialized);
  console.log('mounted      :', field.mounted);
};

const printFieldValue = (field: GeneralField) => {
  console.log('data   :', field.data);
  console.log('value  :', isField(field) ? field.value : '<GeneralField>');
};
