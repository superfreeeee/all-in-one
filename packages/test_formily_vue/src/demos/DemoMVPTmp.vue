<template>
  <div class="demo">
    <h1>Demo MVP</h1>

    <div class="container">
      <FormProvider :form="form">
        <SchemaField :schema="schema" />

        <button @click="onSubmit">Submit</button>
      </FormProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, onMounted } from 'vue';
import { Input } from 'ant-design-vue';
import { logGroup } from 'all-in-one';
import { type Form, createForm, isField } from '@formily/core';
import {
  FormProvider,
  createSchemaField,
  type ISchema,
  FormSymbol,
} from '@formily/vue';

const { SchemaField } = createSchemaField({
  components: {
    Input,
  },
});

const form = createForm({
  // visible: false,
  // display: 'none',
});

// const formContext = inject(FormSymbol);

// console.log('formContext', formContext);

const schema: ISchema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
      'x-reactions': [
        {
          dependencies: ['source', 'target'],
          effects: ['onFieldMount'],
          fulfill: {
            run: '{{ $self.data.onFieldMount($target, $dependencies, $form) }}',
          },
        },
        {
          dependencies: ['source', 'target'],
          effects: ['onFieldValueChange'],
          fulfill: {
            run: '{{ $self.data.onFieldValueChange($target, $dependencies, $form, $self) }}',
          },
        },
      ],
      'x-data': {
        id: 1,
        onFieldMount: (target, deps, form: Form, self) => {
          const sourceField = form
            .query('source')
            .take((field) => (isField(field) ? field : undefined));

          console.log('onFieldMount', {
            target,
            deps,
            sourceField,
            self,
            form,
          });
        },
        onFieldValueChange: (target, deps, form: Form, self) => {
          console.log('onFieldValueChange', { target, deps, self, form });
        },
      },
    },
    source: {
      type: 'string',
      default: 'source value',
      'x-component': 'Input',
      'x-editable': false,
    },
    target: {
      type: 'string',
      default: 'target value',
      'x-component': 'Input',
      'x-editable': false,
    },
  },
};

const onSubmit = () => {
  console.log('form', form);
  form
    .submit((values) => {
      console.log('values', values);
      return values;
    })
    .then((values) => {
      console.log('res', values);
    });
};

const getInputField = () => {
  const inputField = form.query('input').take((field) => {
    if (isField(field)) {
      return field;
    }
  });
  console.log('inputField', inputField);

  return inputField;
};

const printInputField = () => {
  const inputField = getInputField();
  if (!inputField) return;
  console.log('inputField.mounted: ', inputField.mounted);
};

onBeforeMount(() => {
  logGroup('onBeforeMount', () => {
    printInputField();
  });
});

onMounted(() => {
  logGroup('onMounted', () => {
    printInputField();
  });
});

window._form = form;
</script>
