// paste question code here
function intersect(nums1: number[], nums2: number[]): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums1.length; i++) {
    map.set(nums1[i], (map.get(nums1[i]) ?? 0) + 1);
  }
  const res = [];
  for (let i = 0; i < nums2.length; i++) {
    if ((map.get(nums2[i]) ?? 0) > 0) {
      res.push(nums2[i]);
      map.set(nums2[i], map.get(nums2[i])! - 1);
    }
  }
  return res;
}

// generate by ../generate.js
export { intersect };
