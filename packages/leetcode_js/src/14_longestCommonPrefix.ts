function longestCommonPrefix(strs: string[]): string {
  if (strs.length <= 1) {
    return strs[0];
  }
  strs.sort();

  const s1 = strs[0];
  const s2 = strs[strs.length - 1];
  const n = Math.min(s1.length, s2.length);
  for (let i = 0; i < n; i++) {
    if (s1[i] !== s2[i]) {
      return s1.substring(0, i);
    }
  }
  return s1.substring(0, n);
}

export { longestCommonPrefix };
