// paste question code here
function removeDuplicates(nums: number[]): number {
  const len = nums.length;
  if (len <= 2) {
    return len;
  }

  let slow = 2,
    fast = 2;
  while (fast < len) {
    if (nums[fast] != nums[slow - 2]) {
      nums[slow] = nums[fast];
      slow++;
    }
    fast++;
  }

  return slow;
}

// generate by ../generate.js
export { removeDuplicates };
