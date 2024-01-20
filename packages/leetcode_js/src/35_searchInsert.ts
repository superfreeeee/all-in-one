// paste question code here
function searchInsert(nums: number[], target: number): number {
  let lower = 0;
  let upper = nums.length - 1;
  let mid: number;
  if (target < nums[lower]) return 0;
  if (target > nums[upper]) return upper + 1;
  while (lower < upper) {
    mid = Math.floor((lower + upper) / 2);
    if (target === nums[mid]) {
      return mid;
    } else if (target < nums[mid]) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  return lower;
}

// generate by ../generate.js
export { searchInsert };
