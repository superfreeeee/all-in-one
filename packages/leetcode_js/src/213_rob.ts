// paste question code here
function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 1) {
    return nums[0];
  }
  return Math.max(
    // 选第一个
    rob_1(nums.slice(0, n - 1)),
    // 选第二个
    rob_1(nums.slice(1)),
  );
}

function rob_1(nums: number[]): number {
  if (nums.length === 1) {
    return nums[0];
  }

  const n = nums.length;
  let pre = 0;
  let cur = nums[0];
  let tmp;
  for (let i = 1; i < n; i++) {
    tmp = Math.max(cur, pre + nums[i]);
    pre = cur;
    cur = tmp;
  }
  return cur;
}

// generate by ../generate.js
export { rob };
