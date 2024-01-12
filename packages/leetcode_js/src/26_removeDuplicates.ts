// paste question code here
function removeDuplicates(nums: number[]): number {
  let p = 0;
  for (let i = 1, n = nums.length; i < n; i++) {
    if (nums[i] != nums[p]) {
      nums[++p] = nums[i];
    }
  }
  return p + 1;
}

// generate by ../generate.js
export { removeDuplicates };
