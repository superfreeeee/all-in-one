// paste question code here
function minCapability(nums: number[], k: number): number {
  let lower = Math.min(...nums);
  let upper = Math.max(...nums);
  let mid: number;
  const n = nums.length;

  while (lower <= upper) {
    mid = Math.floor((lower + upper) / 2);
    if (fit(mid)) {
      upper = mid - 1;
    } else {
      lower = mid + 1;
    }
  }

  function fit(t: number) {
    let visited = false;
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (visited) {
        visited = false;
      } else if (nums[i] <= t) {
        visited = true;
        count++;
      }
    }
    return count >= k;
  }

  return lower;
}

// generate by ../generate.js
export { minCapability };
