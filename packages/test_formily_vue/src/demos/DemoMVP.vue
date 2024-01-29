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
import { onBeforeMount, onMounted } from 'vue';
import { Input } from 'ant-design-vue';
import { logGroup } from 'all-in-one';
import { createForm, isField } from '@formily/core';
import { FormProvider, createSchemaField, type ISchema } from '@formily/vue';

const { SchemaField } = createSchemaField({
  components: {
    Input,
  },
});

const form = createForm<{ input: string }>();

const schema: ISchema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      default: 'default input',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
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
