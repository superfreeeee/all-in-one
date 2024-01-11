function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  collect(nums, nums.length - 1, res);
  return res;
}

function collect(nums: number[], last: number, res: number[][]) {
  if (last === 0) {
    res.push(nums.slice());
    return;
  }

  collect(nums, last - 1, res);

  for (let i = 0; i < last; i++) {
    swap(nums, i, last);
    collect(nums, last - 1, res);
    swap(nums, i, last);
  }
}

function swap(nums: number[], x: number, y: number) {
  [nums[x], nums[y]] = [nums[y], nums[x]];
}

export { permute };
