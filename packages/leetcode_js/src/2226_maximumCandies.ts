// paste question code here
function maximumCandies(candies: number[], k: number): number {
  function fit(target: number) {
    let k0 = 0;
    let cand: number;
    for (let i = 0; i < candies.length; i++) {
      cand = candies[i];
      if (cand >= target) {
        k0 += Math.floor(cand / target);
      }
      if (k0 >= k) return true;
    }
    return false;
  }

  let lower = 0;
  let upper = 1 + Math.max(...candies); // 允许 mid 指向 max(candies)
  let mid: number;

  while (lower < upper) {
    mid = Math.floor((lower + upper) / 2);
    if (fit(mid)) {
      // lower 永远指向最大满足的下一个
      lower = mid + 1;
    } else {
      upper = mid;
    }
  }

  // 所以 return lower - 1
  return lower - 1;
}

// generate by ../generate.js
export { maximumCandies };
