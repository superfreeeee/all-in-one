import { Form, createForm } from '@formily/core';
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
      console.log('field        :', field);
      console.log('arrayField   :', arrayField);
      console.log('objectField  :', objectField);
      console.log('voidField    :', voidField);

      const fields = form.fields;
      console.log('fields                    :', fields);
      console.log('fields.creation           :', fields.creation);
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
