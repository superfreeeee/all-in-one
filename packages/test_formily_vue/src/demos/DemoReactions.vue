<template>
  <div class="demo">
    <h1>Demo Reactions</h1>

    <div class="container">
      <FormProvider :form="form">
        <SchemaField :schema="schema" />

        <button @click="onSubmit">Submit</button>
      </FormProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { Input } from 'ant-design-vue';
import { logGroup } from 'all-in-one';
import { type Field, createForm, isField, type Form } from '@formily/core';
import {
  FormProvider,
  createSchemaField,
  type ISchema,
  type SchemaReactions,
  type SchemaReaction,
} from '@formily/vue';

const { SchemaField } = createSchemaField({
  components: {
    Input,
  },
});

const form = createForm<{ input: string }>();

const reaction: SchemaReaction<Field> = (field) => {
  console.log('field x-reactions', field);
  console.log('actions', field.actions);
};

const schema: ISchema = {
  type: 'object',
  properties: {
    source: {
      type: 'string',
      'x-component': 'Input',
    },
    input: {
      type: 'string',
      default: 'default input',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
      'x-reactions': [
        {
          target: 'input',
          effects: ['onFieldMount'],
          fulfill: {
            run: '{{ $self.data.onFieldMount($target, $dependencies, $form) }}',
          },
        },
        {
          target: 'input',
          dependencies: ['{{ $form.source }}'],
          effects: ['onFieldValueChange'],
          fulfill: {
            run: '{{ $self.data.onFieldValueChange($target, $dependencies, $form, $self) }}',
          },
        },
      ],
      'x-data': {
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
  },
};

const onSubmit = () => {
  console.log('form', form);
  form.submit((values) => {
    console.log('values', values);
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
  console.log('address  :', inputField.address);
  console.log('path     :', inputField.path);
  console.log('mounted  :', inputField.mounted);
  console.log('value    :', inputField.value);
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
