function twoSum(nums: number[], target: number): number[] {
  const map = {};
  for (let i = 0, n = nums.length; i < n; i++) {
    const num = nums[i];
    if (map[num] !== undefined) {
      return [map[num], i];
    }
    map[target - num] = i;
  }
  return [];
}

export { twoSum };
