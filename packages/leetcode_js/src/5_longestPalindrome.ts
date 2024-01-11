function longestPalindrome(s: string): string {
  // return longestPalindrome_1(s);
  return longestPalindrome_2(s);
}

const centerExpand = function (s: string, l: number, r: number): string {
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    l--;
    r++;
  }
  return s.substring(l + 1, r);
};

function longestPalindrome_2(s: string): string {
  if (s.length <= 1) {
    return s;
  }
  let res = s[0];
  for (let i = 0; i < s.length - 1; i++) {
    const odd = centerExpand(s, i, i);
    const even = centerExpand(s, i, i + 1);
    if (odd.length > res.length) res = odd;
    if (even.length > res.length) res = even;
  }
  return res;
}

function longestPalindrome_1(s: string): string {
  const ss = `*${s.split('').join('*')}*`;
  let mid = 0;
  let maxLen = 0;
  for (let i = 0, n = ss.length; i < n; i++) {
    let len = 0;
    while (
      i - len - 1 >= 0 &&
      i + len + 1 < n &&
      ss[i - len - 1] === ss[i + len + 1]
    ) {
      len += 1;
    }

    if (len > maxLen) {
      mid = i;
      maxLen = len;
    }
  }
  return ss
    .substring(mid - maxLen, mid + maxLen + 1)
    .split('')
    .filter((_, i) => i & 1)
    .join('');
}

export { longestPalindrome };
