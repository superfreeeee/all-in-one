import { Form, GeneralField, createForm, isField } from '@formily/core';
import { cloneDeep } from 'lodash-es';
import { pathExamples } from './Path';
import { fieldExamples } from './Field';
import { tmpExamples } from './tmp';
import { formEffectsExamples } from './FormEffects';

export const formilyEntry = () => {
  // pathExamples();
  // fieldExamples();
  formEffectsExamples();

  // tmpExamples();
};

const formExamples = () => {
  console.log('> formExamples\n');

  // const form = createForm();
  const form = createForm({
    initialValues: INITIAL_VALUE,
  });

  // 初始化后状态
  outputFormBaseState(form);

  initFields(form);

  // 观察 values 变化
  outputFormValues(form);
  // fields 视角
  outputFormFields(form);

  console.log(cloneDeep(form.getValuesIn('.')));
};

// 表单基础状态
const outputFormBaseState = (form: Form) => {
  console.group('表单状态 outputFormState');
  console.log('表单模型 form:', form);
  console.log('表单初始化 form.initialized:', form.initialized);
  console.log('表单校验中 form.validating:', form.validating);
  console.log('表单提交中 form.submitting:', form.submitting);
  console.log('表单是否被修改 form.modified:', form.modified);
  console.log('表单交互模式 form.pattern:', form.pattern);
  console.log('表单展示模式 form.visible:', form.visible);
  console.log('表单已挂载 form.mounted:', form.mounted);
  console.log('表单已卸载 form.unmounted:', form.unmounted);

  outputFormValues(form);

  console.groupEnd();
};

const outputFormValues = (form: Form) => {
  console.log('表单值 form.values:', cloneDeep(form.values));
};

const INITIAL_VALUE = {
  id: 1,
  name: 'superfree',
  inner: {
    count: 777,
  },
  tags: [
    { id: 1001, title: 'tagA' },
    { id: 1002, title: 'tagB' },
  ],
};

const initFields = (form: Form) => {
  // 创建一层基础字段
  form.createField({
    name: 'id',
  });

  // 创建深层基础字段
  form.createField({
    name: 'inner.count',
  });

  // 创建深层基础字段
  form.createField({
    name: 'inner.dynamic',
  });
};

const outputFormFields = (form: Form) => {
  console.group('表单字段 outputFormFields', form.fields);

  console.log('所有字段 form.fields:', form.fields);

  // 访问第一层
  outputFieldState('form.fields.id', form.fields.id);
  outputFieldState('form.fields.none', form.fields.none);
  outputFieldState('form.fields.inner', form.fields.inner);

  // 无法直接访问深层字段
  // outputFieldState('form.fields.inner.count', form.fields.inner.count);

  outputFormValues(form);
  console.log('inner value', form.query('inner').value());
  console.log('inner.count value', form.query('inner.count').value());
  const dynamicField = form.query('inner.dynamic').take((field) => {
    return isField(field) ? field : undefined;
  });
  console.log('inner.dynamic value', dynamicField?.value);
  dynamicField?.setValue(456);
  console.log('inner.dynamic value', dynamicField?.value);
  outputFormValues(form);

  console.groupEnd();
};

const outputFieldState = (source: string, field?: GeneralField) => {
  console.group('字段状态 outputFieldState');

  console.log('状态访问 source:', source);
  console.log('字段模型 field:', field);

  if (field) {
    console.log('字段路径 field.path:', {
      raw: field.path.toString(),
      path: field.path,
    });
    // console.log('字段值 field.value:', field.va);
  }

  console.groupEnd();
};
