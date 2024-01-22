import { isArray } from 'lodash-es';
import { FormPath } from '@formily/core';
import { logGroup } from '../utils/log';
import { examplesFactory } from '../utils/example';

/**
 * FormPath 对象测试
 * https://core.formilyjs.org/zh-CN/api/entry/form-path
 */
export const pathExamples = examplesFactory('pathExamples', () => {
  testCreation();
  testModify();
});

/**
 * 创建测试
 */
const testCreation = (collapse?: boolean) => {
  logGroup(
    'FormPath 创建: testCreation',
    () => {
      // 点路径
      // string
      outputFormPathState(new FormPath('a'));
      outputFormPathState(new FormPath('a.b'));
      outputFormPathState(new FormPath('a.b.c'));
      outputFormPathState(new FormPath('xxx.yyy.zzz'));
      // number
      outputFormPathState(new FormPath(3));
      // array
      outputFormPathState(new FormPath(['a', 'b', 'c']));

      // 下标路径
      outputFormPathState(new FormPath('0'));
      outputFormPathState(new FormPath('a.0'));
      outputFormPathState(new FormPath('a.b.0'));
      outputFormPathState(new FormPath('a[1].2.b.0'));

      //
      outputFormPathState(new FormPath('a.[aa,bb]'));
    },
    collapse,
  );
};

const outputFormPathState = (path: FormPath) => {
  console.group('FormPath state');
  console.log('entire              :', path.entire);
  console.log('segments            :', path.segments);
  console.log('length              :', path.length);
  console.log('isMatchPattern      :', path.isMatchPattern);
  console.log('isWildMatchPattern  :', path.isWildMatchPattern);
  console.log('haveExcludePattern  :', path.haveExcludePattern);
  console.log('tree                :', path.tree);

  console.log('toString            :', path.toString());
  console.log('toArr               :', path.toArr());
  console.groupEnd();
};

/**
 * 更新测试
 */
const testModify = (collapse?: boolean) => {
  logGroup(
    'FormPath 修改对象: testModify',
    () => {
      let target: any;

      console.log('> new target');
      target = {};
      FormPath.setIn(target, 'num', 0);
      FormPath.setIn(target, 'obj.num', 1);
      FormPath.setIn(target, 'arr[1].obj.string', 'str');
      FormPath.setIn(target, 'arr.0', 0);
      FormPath.setIn(target, 'arr[2]', 2);
      FormPath.setIn(target, 'arr[4]', 4);
      FormPath.setIn(target, 'arr.000', 5);

      console.log('target', target);
      console.log('target.arr.length', target.arr.length);
      console.log('isArray(target.arr)', isArray(target.arr));
      (target.arr as any[]).forEach((val, index) => {
        console.log('index:', index, ', val:', val);
      });
      console.log('target.arr[0]', target.arr[0]);
      console.log("target.arr['000']", target.arr['000']);

      console.log('');
      console.log('> new target');
      target = {};
      FormPath.setIn(target, 'parent.[aa,bb]', [11, 22]);
      console.log('target', target);
    },
    collapse,
  );
};
