// paste question code here
/**
 * 只需要使用 O(1) 空间
 * @param nums
 */
function rob(nums: number[]): number {
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

/**
 * 普通 dp
 * 使用 O(n) 空间
 * @param nums
 * @returns
 */
function rob_1(nums: number[]): number {
  if (nums.length === 1) {
    return nums[0];
  }

  const n = nums.length;
  const max_rob = [nums[0], Math.max(nums[0], nums[1])];
  for (let i = 2; i < n; i++) {
    max_rob[i] = Math.max(max_rob[i - 1], max_rob[i - 2] + nums[i]);
  }

  return max_rob[n - 1];
}

// generate by ../generate.js
export { rob };
