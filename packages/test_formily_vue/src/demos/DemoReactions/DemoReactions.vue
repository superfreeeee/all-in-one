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
import { getField, printField } from './utils';
import { addFormEffect } from './effects';

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

/**
 * schema reactions 写法
 * {@link https://vue.formilyjs.org/api/shared/schema.html#schemareactions}
 */
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
      // 'x-reactions': [
      //   {
      //     target: 'input',
      //     effects: ['onFieldMount'],
      //     fulfill: {
      //       run: '{{ $self.data.onFieldMount($target, $dependencies, $form) }}',
      //     },
      //   },
      //   {
      //     target: 'input',
      //     dependencies: ['source'],
      //     effects: ['onFieldValueChange'],
      //     fulfill: {
      //       run: '{{ $self.data.onFieldValueChange($target, $dependencies, $form, $self) }}',
      //     },
      //   },
      //   {
      //     target: 'input',
      //     dependencies: ['source'],
      //     effects: ['onFieldValueChange'],
      //     fulfill: {
      //       run: '{{ onFieldValueChange }}',

      //       // run: '{{ $self.data.onFieldValueChange($target, $dependencies, $form, $self) }}',

      //       // run: (target, deps, form: Form, self) => {
      //       //   console.log('onFieldValueChange callback', {
      //       //     target,
      //       //     deps,
      //       //     self,
      //       //     form,
      //       //   });
      //       // },
      //     },
      //   },
      // ],
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
          console.log('onFieldValueChange data', { target, deps, self, form });
        },
      },
    },
  },
};

addFormEffect(form, {
  type: 'onFieldMount',
  target: 'input',
  deps: {
    source: 'source',
  },
  callback: (target, deps, _form) => {
    logGroup('addFormEffect', () => {
      console.log(
        'target.path  :',
        target.path.toString(),
        '\ntarget       :',
        target,
        '\nquery        :',
        target === form.query('input').take(),
      );
      console.log(
        'deps.path  :',
        { source: deps.source.path.toString() },
        '\ndeps       :',
        deps,
        '\nquery      :',
        { source: deps.source === form.query('source').take() },
      );
      console.log(
        'form   :', //
        _form,
        '\nquery  :',
        _form === form,
      );
    });
  },
});

const onSubmit = () => {
  console.log('form', form);
  form.submit((values) => {
    console.log('values', values);
  });
};

const printInputField = () => {
  const inputField = getField(form, 'input');
  printField(inputField);
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
