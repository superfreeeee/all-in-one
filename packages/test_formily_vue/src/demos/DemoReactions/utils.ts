import {
  isField,
  type Form,
  type FormPathPattern,
  type Field,
} from '@formily/core';
import { logGroup } from 'all-in-one';

export const getField = (form: Form, pattern: FormPathPattern) => {
  const inputField = form.query(pattern).take((field) => {
    if (isField(field)) {
      return field;
    }
  });

  return inputField;
};

export const printField = (field?: Field) => {
  logGroup(`printField, path=${field?.path}`, () => {
    console.log('field    :', field);

    if (!field) {
      console.groupEnd();
      return;
    }
    console.log('address  :', field.address.toString());
    console.log('path     :', field.path.toString());
    console.log('mounted  :', field.mounted);
    console.log('value    :', field.value);
  });
  // console.group(`printField, path=${field?.path}`);

  // console.groupEnd();
};
