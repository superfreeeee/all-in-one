// paste question code here
function searchRange(nums: number[], target: number): number[] {
  if (nums.length === 0) return [-1, -1];
  const left = binarySearch(nums, target, true);
  const right = binarySearch(nums, target, false) - 1;
  if (
    left <= right &&
    right < nums.length &&
    nums[left] === target &&
    nums[right] === target
  ) {
    return [left, right];
  }
  return [-1, -1];
}

function binarySearch(nums: number[], target: number, lower: boolean) {
  let i = 0;
  let j = nums.length - 1;
  let k: number;
  let ans = nums.length;
  while (i <= j) {
    k = Math.floor((i + j) / 2);
    if (nums[k] > target || (lower && nums[k] >= target)) {
      j = k - 1;
      ans = k;
    } else {
      i = k + 1;
    }
  }
  return ans;
}

// generate by ../generate.js
export { searchRange };
