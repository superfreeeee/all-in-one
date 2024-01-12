// paste question code here
function trap(height: number[]): number {
  // return trap_1(height);
  // return trap_2(height);
  return trap_3(height);
}

function trap_3(height: number[]): number {
  if (height.length <= 2) {
    return 0;
  }

  let sum = 0,
    left = 0,
    right = height.length - 1,
    leftMax = 0,
    rightMax = 0;
  while (left < right) {
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);
    if (leftMax < rightMax) {
      sum += leftMax - height[left++];
    } else {
      sum += rightMax - height[right--];
    }
  }

  return sum;
}

/**
 * 找 peak 后
 * 左到 peak + 右到 peak 两次扫描
 * @param height
 * @returns
 */
function trap_2(height: number[]): number {
  if (height.length <= 2) {
    return 0;
  }

  const n = height.length;
  let peak = 0;
  let i: number;
  let cur: number;
  for (i = 1; i < n; i++) {
    if (height[i] > height[peak]) {
      peak = i;
    }
  }

  let sum = 0;

  // left to peak
  for (i = 1, cur = height[0]; i < peak; i++) {
    if (height[i] > cur) {
      cur = height[i];
    } else {
      sum += cur - height[i];
    }
  }

  // right to peak
  for (i = n - 2, cur = height[n - 1]; i > peak; i--) {
    if (height[i] > cur) {
      cur = height[i];
    } else {
      sum += cur - height[i];
    }
  }

  return sum;
}

/**
 * 左到右 + 右到左两次扫描
 * @param height
 * @returns
 */
function trap_1(height: number[]): number {
  if (height.length <= 2) {
    return 0;
  }

  const n = height.length;
  const max = [0];
  max[n - 1] = 0;

  // left to right
  for (let i = 1, cur = height[0]; i < n - 1; i++) {
    if (height[i] > cur) {
      max[i] = 0;
      cur = height[i];
    } else {
      max[i] = cur - height[i];
    }
  }

  // right to left
  for (let i = n - 2, cur = height[n - 1]; i >= 0; i--) {
    if (height[i] > cur) {
      max[i] = 0;
      cur = height[i];
    } else {
      max[i] = Math.min(max[i], cur - height[i]);
    }
  }

  return max.reduce((res, next) => res + next, 0);
}

// generate by ../generate.js
export { trap };
