import { describe, test, expect, beforeEach } from 'vitest';
import {
  Form,
  GeneralField,
  createForm,
  isField,
  onFieldChange,
  onFieldInit,
  onFieldMount,
  onFieldValueChange,
  onFormInit,
  onFormMount,
  onFormSubmit,
  onFormSubmitEnd,
  onFormSubmitFailed,
  onFormSubmitStart,
  onFormSubmitSuccess,
  onFormSubmitValidateEnd,
  onFormSubmitValidateFailed,
  onFormSubmitValidateStart,
  onFormSubmitValidateSuccess,
  onFormValidateEnd,
  onFormValidateStart,
} from '@formily/core';
import { createGlobalStepChecker, createSharedStepRecorder } from './helpers';

const expectStep = createGlobalStepChecker();
const recorder = createSharedStepRecorder();

describe('form effects tests', () => {
  /**
   * 使用 createForm effects 添加 effects
   */
  test('onFormInit by createForm', () => {
    expectStep(1);

    let initForm: Form | null = null;
    const form = createForm({
      effects(_) {
        /**
         * effects 同步触发
         */
        expectStep(2);

        onFormInit((form) => {
          /**
           * onFormInit 同步触发
           */
          expectStep(3);
          initForm = form;
        });
      },
    });

    expectStep(4);

    expect(initForm).toBe(form);
  });

  /**
   * 使用 addEffects 添加 effects
   */
  test('onFormInit, onFormMount by addEffects', () => {
    const form = createForm();

    expect(form.initialized).toBe(true);

    let initForm: Form | null = null;
    let mountForm: Form | null = null;
    expectStep(1);
    form.addEffects(0, () => {
      expectStep(2);

      /**
       * 使用 addEffects 异步添加的 onFormInit 不会同步触发
       * 即便 form.initialized = true
       */
      onFormInit((form) => {
        expectStep(5);
        initForm = form;
      });

      onFormMount((form) => {
        expectStep(7);
        mountForm = form;
      });
    });

    expectStep(3);

    expect(initForm).toBe(null);
    expect(mountForm).toBe(null);

    expectStep(4); // 4: 触发 onInit
    form.onInit();

    expect(initForm).toBe(form);
    expect(mountForm).toBe(null);

    expectStep(6); // 6. 触发 onMount
    form.onMount();

    expect(initForm).toBe(form);
    expect(mountForm).toBe(form);

    expectStep(8);
  });

  /**
   * submit 顺序
   *
   * 触发点> 3: form.submit
   * 4: onFormSubmitStart
   * 5, 6: onSubmit 回调 => 内部同步
   * 7: onFormSubmitEnd
   * 8: onFormSubmit
   * 9: submit.then 回调
   */
  test('onFormSubmit', async () => {
    /**
     * 注释这一行能看到 expect 输出
     */
    expectStep.hide();

    const form = createForm({
      initialValues: {
        id: 111,
      },
    });

    expectStep(1, 'before addEffects');
    form.addEffects(0, () => {
      expectStep(2, 'form.addEffects');

      onFormSubmitStart((_form) => {
        expectStep(4, 'onFormSubmitStart');
        expect(_form).toBe(form);
      });

      onFormSubmitEnd((_form) => {
        expectStep(7, 'onFormSubmitEnd');
        expect(_form).toBe(form);
      });

      onFormSubmit((_form) => {
        expectStep(8, 'onFormSubmit');
        expect(_form).toBe(form);
      });
    });

    expectStep(3, 'form.submit'); // 3: form.submit
    await form
      .submit(async (values) => {
        expectStep(5, 'onSubmit callback 1');

        expect(form.submitting).toBe(false); // 同步下还是 false

        // ! formliy 内部关于 submitting 状态的更新设置了 setTimout 100
        // ! validate 状态的更新也同理
        // ! 具体参考 https://github.com/alibaba/formily/blob/formily_next/packages/core/src/shared/internals.ts#L769
        await new Promise((resolve) => setTimeout(resolve, 110));

        expectStep(6, 'onSubmit callback 2');

        // 异步流程内变为 true
        expect(form.submitting).toBe(true);

        return values;
      })
      .then((value) => {
        expectStep(9, 'submit.then');
        expect(form.submitting).toBe(false);
        // submit 的 onSubmit 回调传入的 values 已经解构了
        expect(value).not.toBe(form.values);
        expect(value).toEqual(form.values);
      });
  });

  /**
   * onFormValidate 与 onFormSubmit 之间的顺序关系
   */
  test('onFormSubmit, onFormValidate', async () => {
    expectStep.hide();

    const form = createForm({
      initialValues: {},
    });

    form.createField({
      name: 'a',
      validator: () => {
        expectStep(5, 'validator');
        return null;
      },
    });

    expectStep(1, 'before addEffects');
    form.addEffects(0, () => {
      expectStep(2, 'form.addEffects');

      /**
       * 只有 submit 的 validate 阶段会触发
       */
      onFormSubmitValidateStart((_form) => {
        expectStep(3, 'onFormSubmitValidateStart');
      });

      onFormSubmitValidateEnd((_form) => {
        expectStep(8, 'onFormSubmitValidateEnd');
      });

      /**
       * Success / Failed 介于 start 跟 end 中间
       */
      onFormSubmitValidateSuccess((_form) => {
        expectStep(7, 'onFormSubmitValidateSuccess');
        // 有点傻逼的情况是 validate Success 的回调内部 error 了会变成 validateFailed
        // throw new Error();
      });

      onFormSubmitValidateFailed((_form) => {
        expectStep(-1, 'onFormSubmitValidateFailed');
      });

      /**
       * submit 跟 validate 方法都会触发
       * 在 onFormSubmitValidateStart 之后
       */
      onFormValidateStart(() => {
        expectStep(4, 'onFormValidateStart');
      });

      /**
       * 在 onFormSubmitValidateEnd 之前
       */
      onFormValidateEnd(() => {
        expectStep(6, 'onFormValidateEnd');
      });

      /**
       * 在 onSubmit callback 之后
       * onFormSubmit 之前
       */
      onFormSubmitSuccess(() => {
        expectStep(10, 'onFormSubmitSuccess');
      });

      onFormSubmitFailed(() => {
        expectStep(-1, 'onFormSubmitFailed');
      });

      onFormSubmit(() => {
        expectStep(11, 'onFormSubmit');
      });
    });

    await form
      .submit((values) => {
        /**
         * callback 位于 validate 之后
         */
        expectStep(9, 'onSubmit callback');
        return Promise.resolve(values);
      })
      .then((value) => {
        expectStep(12, 'submit.then');
      });
  });
});

describe('field effects tests', () => {
  let form: Form;

  beforeEach(() => {
    // 刷新 form 对象
    form = createForm();
  });

  /**
   * field 创建前(createField) 使用 addEffects 监听
   */
  test('onFieldInit before field create', () => {
    recorder.record('before addEffects');

    let initField: GeneralField | null = null;
    form.addEffects(0, () => {
      recorder.record('addEffects start');

      onFieldInit('a', (field) => {
        /**
         * onFieldInit 在 createField 后触发
         */
        recorder.record(`onFieldInit, path=${field.path}`);
        initField = field;
      });
    });

    recorder.record('after addEffects');

    const field = form.createField({ name: 'a' });
    expect(initField).toBe(field);

    // recorder.show();
    recorder.expect([
      'before addEffects', //
      'addEffects start',
      'after addEffects',
      'onFieldInit, path=a',
    ]);
  });

  /**
   * field 创建后(createField) 使用 addEffects 监听
   */
  test('onFieldInit, onFieldMount after field created', () => {
    const field = form.createField({ name: 'a' });

    expect(field.initialized).toBe(true); // 创建时已经初始化完成

    let initField: GeneralField | null = null;
    let mountField: GeneralField | null = null;
    recorder.record('before addEffects');
    form.addEffects(0, () => {
      recorder.record('addEffects 1');

      onFieldInit('a', (field) => {
        /**
         * onFieldInit 在 field 已经存在时会同步触发
         */
        recorder.record('onFieldInit');
        initField = field;
      });

      recorder.record('addEffects 2');

      onFieldMount('a', (field) => {
        /**
         * onFieldMount 会在 field.onMount(step: 6) 后触发
         */
        recorder.record('onFieldMount');
        mountField = field;
      });
    });

    expect(initField).toBe(field);
    expect(mountField).toBe(null);

    recorder.record('before field.onInit');
    field.onInit(); // 这里的 onInit 无效

    expect(initField).toBe(field);
    expect(mountField).toBe(null);

    recorder.record('before field.onMount');
    field.onMount();

    expect(initField).toBe(field);
    expect(mountField).toBe(field);

    // recorder.show();
    recorder.expect([
      'before addEffects',
      'addEffects 1',
      'onFieldInit',
      'addEffects 2',
      'before field.onInit',
      'before field.onMount',
      'onFieldMount',
    ]);
  });

  /**
   * onFieldChange 触发顺序
   * 触发点> 2: createField
   * 3: onFieldChange
   * 4: return created field
   */
  test('onFieldChange timing', () => {
    const form = createForm({
      initialValues: { a: 111 },
    });

    recorder.record('before addEffects 1');

    let changedField: GeneralField | null = null;
    form.addEffects(0, () => {
      onFieldChange('a', (field) => {
        // 3: after createField, before field created
        recorder.record('onFieldChange');
        // createField 的过程会触发一次
        changedField = field;
      });
    });

    // 1: before createField
    recorder.record('before createField');
    // onFieldChange 在 createField 过程中触发
    const field = form.createField({ name: 'a' });

    // 4: field 创建完成
    recorder.record('after createField');
    expect(changedField).toBe(field);

    form.addEffects(1, () => {
      recorder.record('addEffects 2: after createField');

      onFieldChange('a', (field) => {
        // field 已经创建的情况，onFieldChange 会同步触发
        recorder.record('onFieldChange 2');
        changedField = field;
      });

      recorder.record('addEffects 2 end');
    });

    recorder.record('after addEffects 2');

    // recorder.show();
    recorder.expect([
      'before addEffects 1',
      'before createField',
      'onFieldChange',
      'after createField',
      'addEffects 2: after createField',
      'onFieldChange 2',
      'addEffects 2 end',
      'after addEffects 2',
    ]);
  });

  /**
   * 检查 onFieldChange 响应返回
   */
  test('onFieldChange', () => {
    form.addEffects(0, () => {
      onFieldChange('a', (field) => {
        if (isField(field)) {
          recorder.record(`onFieldChange, id=${field.data.id}, value=${field.value}`);
        } else {
          recorder.record('onFieldChange');
        }
      });
    });

    // createField 触发一次
    const field = form.createField({ name: 'a', value: 111, data: { id: 1 } });
    // value 改变会触发
    field.value = 222;
    // data 改变不会触发
    field.data.id = 10;
    // hidden 不会触发
    field.setDisplay('hidden');
    // none 会触发
    field.setDisplay('none');

    // recorder.show();
    recorder.expect([
      'onFieldChange, id=1, value=111',
      'onFieldChange, id=1, value=222',
      'onFieldChange, id=10, value=undefined',
    ]);
  });

  /**
   * onFieldChange 与 onFieldValueChange 差异
   */
  test('onFieldChange, onFieldValueChange', () => {
    form.addEffects(0, () => {
      onFieldChange('a', (field) => {
        if (isField(field)) {
          recorder.record(`onFieldChange, id=${field.data.id}, value=${field.value}`);
        } else {
          recorder.record('onFieldChange');
        }
      });

      onFieldValueChange('a', (field) => {
        if (isField(field)) {
          recorder.record(`onFieldValueChange, id=${field.data.id}, value=${field.value}`);
        } else {
          recorder.record('onFieldValueChange');
        }
      });
    });

    // createField 触发 onFieldChange
    const field = form.createField({ name: 'a', value: 111, data: { id: 1 } });
    // value 改变会触发 onFieldChange, onFieldValueChange
    field.value = 222;
    // data 改变不会触发
    field.data.id = 10;
    // hidden 不会触发
    field.setDisplay('hidden');
    // none 会触发 onFieldChange, onFieldValueChange
    field.setDisplay('none');

    // recorder.show();
    recorder.expect([
      'onFieldChange, id=1, value=111',
      'onFieldValueChange, id=1, value=222',
      'onFieldChange, id=1, value=222',
      'onFieldValueChange, id=10, value=undefined',
      'onFieldChange, id=10, value=undefined',
    ]);
  });
});
