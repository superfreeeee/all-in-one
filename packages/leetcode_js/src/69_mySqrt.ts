// paste question code here
function mySqrt(x: number): number {
  if (x <= 1) return x;
  let lower = 1;
  let upper = Math.floor(x / 2) + 1;
  let mid: number;
  let tmp: number;
  while (upper - lower > 1) {
    mid = Math.floor((lower + upper) / 2);
    tmp = mid * mid;
    if (tmp === x) {
      return mid;
    } else if (tmp < x) {
      lower = mid;
    } else {
      upper = mid;
    }
  }
  return lower;
}

// generate by ../generate.js
export { mySqrt };
