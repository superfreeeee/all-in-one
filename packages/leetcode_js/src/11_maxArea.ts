function maxArea(height: number[]): number {
  return maxAreaInner(height, 0, height.length - 1);
}

function maxAreaInner(height: number[], left: number, right: number): number {
  if (left === right) {
    return 0;
  }
  let area = Math.min(height[left], height[right]) * (right - left);
  while (left < right) {
    area = Math.max(
      area,
      Math.min(height[left], height[right]) * (right - left),
    );
    if (height[left] < height[right]) {
      const lastLeft = height[left];
      do {
        left += 1;
      } while (left < right && height[left] <= lastLeft);
    } else {
      const lastRight = height[right];
      do {
        right -= 1;
      } while (left < right && height[right] <= lastRight);
    }
  }
  return area;
}

export { maxArea };
