import { describe, test, expect } from 'vitest';
import { createForm } from '@formily/core';

describe('field validate tests', () => {
  /**
   * 基础 validator demo
   */
  test('smoke test', async () => {
    const form = createForm({
      initialValues: { a: 1 },
    });

    const field = form.createField({
      name: 'a',
      validator: (value, rules, context) => {
        /**
         * 各参数可用字段
         * rules.validator;
         * rules.message;
         *
         * context.validator;
         * context.field;
         * context.form;
         */
        // 不返回任何东西表示校验成功
        // return false;
      },
    });

    await (field.validate() as Promise<any>);
    // resolve 表示校验通过
  });

  /**
   * validator 不同返回值
   */
  test('validator return type', async () => {
    const form = createForm({
      initialValues: {
        n: 111,
        b: true,
        s: 'str',
      },
    });

    /**
     * 返回字符串时，作为失败原因
     */
    const nField = form.createField({
      name: 'n',
      validator: () => {
        return 'failed reason';
      },
    });

    await nField.validate().catch((errors) => {
      const error = errors[0];
      // console.log(error);
      expect(error.type).toBe('error');
      expect(error.code).toBe('ValidateError');
      expect(error.messages).toEqual(['failed reason']);
    });

    /**
     * 返回 null 表示通过
     */
    const bField = form.createField({
      name: 'b',
      validator: () => {
        return null;
      },
    });

    await bField.validate();

    /**
     * 返回具体结构
     */
    const sField = form.createField({
      name: 's',
      validator: () => {
        return {
          /**
           * type warning 跟 type success 都不会阻塞 validate 方法
           * 但是也不会把具体对象暴露出去，估计就是给 field 消费用的?
           */
          type: 'error',
          message: 'custom message',
        };
      },
    });

    await sField.validate().catch((errors) => {
      const error = errors[0];
      // console.log(error);
      expect(error.type).toBe('error');
      expect(error.code).toBe('ValidateError');
      expect(error.messages).toEqual(['custom message']);
    });

    /**
     * form 会校验所有 field
     * 返回两个 error 对象
     */
    await (form.validate() as Promise<any>).catch((errors) => {
      expect(errors.length).toBe(2);
      errors.forEach((error) => {
        expect(error.type).toBe('error');
      });
    });
  });
});
