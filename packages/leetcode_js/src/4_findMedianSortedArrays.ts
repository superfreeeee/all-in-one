function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // return findMedianSortedArrays_1(nums1, nums2);
  return findMedianSortedArrays_2(nums1, nums2);
}

function findMedianSortedArrays_2(nums1: number[], nums2: number[]): number {
  const n = nums1.length + nums2.length;
  if (n & 1) {
    return findMedianSortedArrays_2_getKth(nums1, nums2, 0, 0, (n + 1) / 2);
  } else {
    const k1 = n / 2;
    const left = findMedianSortedArrays_2_getKth(nums1, nums2, 0, 0, k1);
    const right = findMedianSortedArrays_2_getKth(nums1, nums2, 0, 0, k1 + 1);
    return (left + right) / 2;
  }
}

function findMedianSortedArrays_2_getKth(
  nums1: number[],
  nums2: number[],
  i: number,
  j: number,
  k: number, // 1-based
): number {
  const m = nums1.length - i;
  const n = nums2.length - j;
  if (m < n) {
    // ensure m >= n
    return findMedianSortedArrays_2_getKth(nums2, nums1, j, i, k);
  }
  if (n === 0) {
    return nums1[i + k - 1];
  }
  if (k === 1) {
    return Math.min(nums1[i], nums2[j]);
  }
  const mid1 = i + Math.min(Math.floor(k / 2), m) - 1;
  const mid2 = j + Math.min(Math.floor(k / 2), n) - 1;

  if (nums1[mid1] < nums2[mid2]) {
    return findMedianSortedArrays_2_getKth(
      nums1,
      nums2,
      mid1 + 1,
      j,
      k - (mid1 - i + 1),
    );
  } else {
    return findMedianSortedArrays_2_getKth(
      nums1,
      nums2,
      i,
      mid2 + 1,
      k - (mid2 - j + 1),
    );
  }
}

function findMedianSortedArrays_1(nums1: number[], nums2: number[]): number {
  const nums = nums1.concat(nums2);
  nums.sort((x, y) => x - y);
  const n = nums.length;
  if (n & 1) {
    return nums[(n - 1) / 2];
  } else {
    return (nums[n / 2] + nums[n / 2 - 1]) / 2;
  }
}

export { findMedianSortedArrays };
