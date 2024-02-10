import { describe, test, expect, beforeEach } from 'vitest';
import {
  Form,
  GeneralField,
  createForm,
  onFieldChange,
  onFieldInit,
  onFieldMount,
  onFormInit,
  onFormMount,
  onFormSubmit,
  onFormSubmitEnd,
  onFormSubmitStart,
} from '@formily/core';
import { createGlobalStepChecker } from './helpers';

const expectStep = createGlobalStepChecker();

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
    const form = createForm({
      initialValues: {
        id: 111,
      },
    });

    expectStep(1);
    form.addEffects(0, () => {
      expectStep(2);

      onFormSubmitStart((_form) => {
        expectStep(4);
        expect(_form).toBe(form);
      });

      onFormSubmitEnd((_form) => {
        expectStep(7);
        expect(_form).toBe(form);
      });

      onFormSubmit((_form) => {
        expectStep(8);
        expect(_form).toBe(form);
      });
    });

    expectStep(3); // 3: form.submit
    await form
      .submit(async (values) => {
        expectStep(5);

        expect(form.submitting).toBe(false); // 同步下还是 false

        // ! formliy 内部关于 submitting 状态的更新设置了 setTimout 100
        // ! validate 状态的更新也同理
        // ! 具体参考 https://github.com/alibaba/formily/blob/formily_next/packages/core/src/shared/internals.ts#L769
        await new Promise((resolve) => setTimeout(resolve, 110));

        expectStep(6);

        // 异步流程内变为 true
        expect(form.submitting).toBe(true);

        return values;
      })
      .then((value) => {
        expectStep(9);
        expect(form.submitting).toBe(false);
        // submit 的 onSubmit 回调传入的 values 已经解构了
        expect(value).not.toBe(form.values);
        expect(value).toEqual(form.values);
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
    let initField: GeneralField | null = null;
    expectStep(1);
    form.addEffects(0, () => {
      expectStep(2); // addEffects 是同步的

      onFieldInit('a', (field) => {
        /**
         * onFieldInit 在 createField 后触发
         */
        expectStep(4);
        initField = field;
      });
    });

    expectStep(3); // 3: createField
    const field = form.createField({ name: 'a' });
    expect(initField).toBe(field);
  });

  /**
   * field 创建后(createField) 使用 addEffects 监听
   */
  test('onFieldInit, onFieldMount after field created', () => {
    const field = form.createField({ name: 'a' });

    expect(field.initialized).toBe(true); // 创建时已经初始化完成

    let initField: GeneralField | null = null;
    let mountField: GeneralField | null = null;
    expectStep(1);
    form.addEffects(0, () => {
      expectStep(2);

      onFieldInit('a', (field) => {
        /**
         * onFieldInit 在 field 已经存在时会同步触发
         */
        expectStep(3);
        initField = field;
      });

      expectStep(4);

      onFieldMount('a', (field) => {
        /**
         * onFieldMount 会在 field.onMount(step: 6) 后触发
         */
        expectStep(7);
        mountField = field;
      });
    });

    expect(initField).toBe(field);
    expect(mountField).toBe(null);

    expectStep(5);
    field.onInit(); // 这里的 onInit 无效

    expect(initField).toBe(field);
    expect(mountField).toBe(null);

    expectStep(6);
    field.onMount();

    expect(initField).toBe(field);
    expect(mountField).toBe(field);
  });

  /**
   * onFieldChange 顺序
   * 触发点> 2: createField
   * 3: onFieldChange
   * 4: return created field
   */
  test('onFieldChange', () => {
    const form = createForm({
      initialValues: { a: 111 },
    });

    expectStep(1); // 1: before addEffects

    let changedField: GeneralField | null = null;
    form.addEffects(0, () => {
      onFieldChange('a', (field) => {
        // createField 的过程会触发一次
        expectStep(3); // 3: after createField, before field created
        changedField = field;
      });
    });

    expectStep(2); // 1: before createField
    // onFieldChange 在 createField 过程中触发
    const field = form.createField({ name: 'a' });

    expectStep(4); // 4: field 创建完成
    expect(changedField).toBe(field);

    form.addEffects(1, () => {
      expectStep(5);

      onFieldChange('a', (field) => {
        // field 已经创建的情况，onFieldChange 会同步触发
        expectStep(6);
        changedField = field;
      });

      expectStep(7);
    });

    expectStep(8);
  });
});
