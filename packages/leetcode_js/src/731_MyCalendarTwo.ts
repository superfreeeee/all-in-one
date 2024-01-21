// paste question code here
class MyCalendarTwo {
  // 区间可能重复计算
  arr: [number, number][] = [];
  doubleArr: [number, number][] = [];

  book(start: number, end: number): boolean {
    // 检查二重区间
    for (let item of this.doubleArr) {
      if (start >= item[1] || end <= item[0]) continue;
      return false;
    }
    // 检查一重区间
    for (let item of this.arr) {
      if (start >= item[1] || end <= item[0]) continue;
      // 加入重复区间
      this.doubleArr.push([Math.max(start, item[0]), Math.min(end, item[1])]);
    }
    // 加入一重区间
    this.arr.push([start, end]);
    return true;
  }
}

type Node = { sum: number; leaf: number };

const MAX_VAL = 1e9;

class MyCalendarTwo_1 {
  // index 为树的下标，0-based
  private tree: Node[] = [];

  constructor() {}

  book(start: number, end: number): boolean {
    this.update(start, end - 1, 1, 0, MAX_VAL, 0);
    if ((this.tree[0]?.sum ?? 0) > 2) {
      this.update(start, end - 1, -1, 0, MAX_VAL, 0);
      return false;
    }
    return true;
  }

  private update(
    // 更新目标值
    start: number,
    end: number,
    // 浮动值
    val: 1 | -1,
    // 节点区间
    left: number,
    right: number,
    // 当前节点
    index: number,
  ) {
    // 非区间内
    if (start > right || end < left) return;

    if (!this.tree[index]) {
      this.tree[index] = { sum: 0, leaf: 0 };
    }

    // 完全重合 => 叶子
    if (start <= left && end >= right) {
      this.tree[index].sum += val; // 自己 + 子节点的最大重合数
      this.tree[index].leaf += val; // 作为叶子的值
      return;
    }

    // 部分重合 => 由子节点合并
    const mid = (left + right) >> 1;
    // 更新左右区间
    this.update(start, end, val, left, mid, 2 * index + 1);
    this.update(start, end, val, mid + 1, right, 2 * index + 2);
    // 更新自己
    this.tree[index].sum =
      this.tree[index].leaf +
      Math.max(
        this.tree[2 * index + 1]?.sum ?? 0,
        this.tree[2 * index + 2]?.sum ?? 0,
      );
  }
}

/**
 * Your MyCalendarTwo object will be instantiated and called as such:
 * var obj = new MyCalendarTwo()
 * var param_1 = obj.book(start,end)
 */

// generate by ../generate.js
export { MyCalendarTwo };
