import { findMedianSortedArrays } from './4_findMedianSortedArrays';

const tests = [
  {
    nums1: [1, 3],
    nums2: [2],
    ans: 2,
  },
  {
    nums1: [1, 2],
    nums2: [3, 4],
    ans: 2.5,
    only: false,
    // only: true,
  },
  {
    nums1: [3],
    nums2: [-2, -1],
    ans: -1,
  },
];

tests.forEach(({ nums1, nums2, ans, only }, i) => {
  const it = only ? test.only : test;
  it(`test ${i + 1}`, () => {
    const res = findMedianSortedArrays(nums1, nums2);
    expect(res).toEqual(ans);
  });
});
