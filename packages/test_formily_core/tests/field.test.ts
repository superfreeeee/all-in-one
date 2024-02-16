import { describe, expect, test } from 'vitest';
import { createForm, isField } from '@formily/core';
import { createSharedStepRecorder } from './helpers';

const recorder = createSharedStepRecorder();

describe('field tests', () => {
  /**
   * 测试 Field 对象状态
   */
  test('field state test', () => {
    const form = createForm();

    const field = form.createField({
      basePath: 'root',
      name: 'a',
      title: 'title a',
      description: 'desc a',
    });

    // 状态验证
    expect(field.title).toBe('title a');
    expect(field.description).toBe('desc a');
    expect(field.display).toBe('visible');
    expect(field.required).toBe(false);

    // 实 Field 下 address 与 path 等价
    expect(field.address.toArr()).toEqual(['root', 'a']);
    expect(field.address.toString()).toBe('root.a');

    expect(field.path.toArr()).toEqual(['root', 'a']);
    expect(field.path.toString()).toBe('root.a');

    // 初始状态
    recorder.record(`initialized : ${field.initialized}`); // true
    recorder.record(`mounted     : ${field.mounted}`); // false

    field.onMount();

    // onMount 更新 mounted 状态
    recorder.record(`initialized : ${field.initialized}`); // true
    recorder.record(`mounted     : ${field.mounted}`); // true

    // recorder.show();
    recorder.expect([
      'initialized : true',
      'mounted     : false',
      'initialized : true',
      'mounted     : true',
    ]);
  });

  /**
   * 测试 reactions
   * 单向依赖
   *
   * ! 测试下来，reactions 字段的作用似乎与 effects 并无差异
   * ! effects 能处理更多更精细的控制方法，应该是全部考虑使用 effects 的 lifecycle 写法
   */
  test('field reactions test', () => {
    const form = createForm();

    // base field
    recorder.record('before createField base');
    const baseField = form.createField({ name: 'base', value: 1 });
    recorder.record('after createField base');

    // test field
    recorder.record('before createField test');
    const testField = form.createField({
      name: 'test',
      value: 0,
      reactions: (field) => {
        recorder.record('test field reactions: start');
        recorder.record(`test field reactions: current value = ${field.value}`);
        const fieldA = field.query('base').take();
        if (isField(fieldA)) {
          // 基于 base field 值更新自己的值
          recorder.record(`test field reactions: base value = ${fieldA.value}`);
          const nextValue = fieldA.value * 10;
          field.setValue(nextValue);
          recorder.record(`test field reactions: next value = ${nextValue}`);
        }
      },
    });
    recorder.record('after createField test');

    // 初始化收集依赖的时候更新 field 不会生效
    recorder.record(`base = ${baseField.value}, test = ${testField.value}`);

    // 初始化流程
    // recorder.show();
    recorder.expect([
      // base field 顺序执行
      'before createField base',
      'after createField base',
      // test field reactions 会同步触发
      'before createField test',
      'test field reactions: start',
      'test field reactions: current value = 0',
      'test field reactions: base value = 1',
      'test field reactions: next value = 10',
      'after createField test',
      // 初始化中的 setValue 不会真的应用到 field 上
      'base = 1, test = 0',
    ]);

    /**
     * 响应式测试
     * reactions 触发条件: 设置 value
     * 更新其他条件都不会触发
     */
    baseField.value = 2;
    baseField.setValue(3);
    baseField.setState({ value: 4 });

    // recorder.show();
    recorder.expect([
      'test field reactions: start',
      'test field reactions: current value = 0',
      'test field reactions: base value = 2',
      'test field reactions: next value = 20',
      'test field reactions: start',
      'test field reactions: current value = 20',
      'test field reactions: base value = 3',
      'test field reactions: next value = 30',
      'test field reactions: start',
      'test field reactions: current value = 30',
      'test field reactions: base value = 4',
      'test field reactions: next value = 40',
    ]);
  });

  /**
   * 测试 reaction
   * TODO 未完成
   */
  test.skip('field reaction test', () => {
    const form = createForm();

    // field a
    recorder.record('before createField a');
    const aField = form.createField({
      name: 'a',
      data: { id: 1 },
      reactions: (_field) => {
        recorder.record('reactions a: start');

        const bField = _field.query('b').take();
        recorder.record(`reactions a: found bField = ${!!bField}`);
        if (isField(bField)) {
          recorder.record('reactions a: set by bField start');
          _field.setValue((bField.value ?? 0) * 10);
          recorder.record('reactions a: set by bField end');
        }
      },
    });
    recorder.record('after createField a');

    recorder.show();
    recorder.reset();

    // field b
    recorder.record('before createField b');
    const bField = form.createField({
      name: 'b',
      data: { id: 2 },
      reactions: (_field) => {
        recorder.record('reactions b: start');

        const aField = _field.query('a').take();
        recorder.record(`reactions b: found aField = ${!!aField}`);
        if (isField(aField)) {
          recorder.record('reactions b: set by aField start');
          _field.setValue((aField.value ?? 0) * 10);
          recorder.record('reactions b: set by aField end');
        }
      },
    });
    recorder.record('after createField b');

    recorder.show();
    recorder.reset();

    recorder.record(form.values);
    recorder.show();

    bField.value = 1;

    recorder.show();
  });
});
