// paste question code here
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let mid: number;
  while (left <= right) {
    mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    }

    // left - mid 为单调
    if (nums[left] <= nums[mid]) {
      if (target < nums[mid] && target >= nums[left]) {
        // left - mid
        right = mid - 1;
      } else {
        // mid - right
        left = mid + 1;
      }
    } else {
      // mid - right 为单调
      if (target > nums[mid] && target <= nums[right]) {
        // mid - right
        left = mid + 1;
      } else {
        // left - mid
        right = mid - 1;
      }
    }
  }
  return -1;
}

function search_1(nums: number[], target: number): number {
  if (nums.length === 1) {
    return target === nums[0] ? 0 : -1;
  }

  const rotate_index = search_rotate(nums);
  if (rotate_index <= 0) {
    return binary_search(nums, 0, nums.length - 1, target);
  }

  if (target >= nums[0]) {
    return binary_search(nums, 0, rotate_index - 1, target);
  } else {
    return binary_search(nums, rotate_index, nums.length - 1, target);
  }
}

function search_rotate(nums: number[]): number {
  const n = nums.length;
  if (nums[n - 1] > nums[0]) {
    return -1;
  }
  let lower = 0;
  let upper = n - 1;
  let mid: number;
  while (lower < upper) {
    mid = Math.floor((lower + upper) / 2);
    if (nums[mid] < nums[0]) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  return lower;
}

function binary_search(
  nums: number[],
  left: number,
  right: number,
  target: number,
): number {
  const n = nums.length;
  let lower = left;
  let upper = right;
  let mid: number;
  while (lower <= upper) {
    mid = Math.floor((lower + upper) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      lower = mid + 1;
    } else {
      upper = mid - 1;
    }
  }
  return -1;
}

// generate by ../generate.js
export { search };
