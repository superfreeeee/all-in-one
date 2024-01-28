import { Field, Form, GeneralField, VoidField, createForm, isDataField } from '@formily/core';
import { examplesFactory } from '../utils/example';
import { logGroup } from '../utils/log';

export const fieldExamples = examplesFactory('fieldExamples', () => {
  const form = createForm();

  testCreation(form);
});

const testCreation = (form: Form) => {
  logGroup(
    'Field 创建: testCreation',
    () => {
      const field = form.createField({ name: 'creation.field' });
      const arrayField = form.createArrayField({ name: 'creation.arrayField' });
      const objectField = form.createObjectField({ name: 'creation.objectField' });
      const voidField = form.createVoidField({ name: 'creation.voidField' });
      outputGeneralFieldState(field);
      outputGeneralFieldState(arrayField);
      outputGeneralFieldState(objectField);
      outputGeneralFieldState(voidField);

      const fields = form.fields;
      console.log(
        'fields                    :', //
        fields,
      );
      console.log(
        'fields.creation           :', //
        fields.creation,
      );
      console.log(
        "fields['creation.field']  :",
        fields['creation.field'],
        fields['creation.field'] === field,
      );

      // query
      console.log('query=creation', form.query('creation').map());
      console.log('query=creation.', form.query('creation.').map());
      // wrong syntax
      // console.log(form.query('creation*').map());
      console.log('query=creation.*', form.query('creation.*').map());
    },
    false,
  );
};

const outputGeneralFieldState = (field: GeneralField) => {
  if (isDataField(field)) {
    outputFieldState(field);
  } else {
    outputVoidFieldState(field);
  }
};

const outputFieldState = (field: Field) => {
  logGroup(
    'Field state',
    () => {
      console.log('address      :', field.address.toString(), field.address);
      console.log('path         :', field.path.toString(), field.path);
      console.log('title        :', field.title);
      console.log('description  :', field.description);

      console.log('initialized  :', field.initialized);
      console.log('mounted      :', field.mounted);
      console.log('unmounted    :', field.unmounted);
    },
    false,
  );
};

const outputVoidFieldState = (field: VoidField) => {
  logGroup(
    'VoidField state',
    () => {
      console.log('address      :', field.address.toString(), field.address);
      console.log('path         :', field.path.toString(), field.path);
      console.log('title        :', field.title);
      console.log('description  :', field.description);

      console.log('initialized  :', field.initialized);
      console.log('mounted      :', field.mounted);
      console.log('unmounted    :', field.unmounted);
    },
    false,
  );
};
