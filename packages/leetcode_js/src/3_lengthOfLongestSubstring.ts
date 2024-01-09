function lengthOfLongestSubstring(s: string): number {
  const chars = new Set();
  let from = 0,
    to = 0,
    len = 0;
  while (from < s.length) {
    while (to < s.length && !chars.has(s[to])) {
      chars.add(s[to]);
      to++;
    }
    len = Math.max(len, to - from);
    chars.delete(s[from]);
    from++;
  }
  return len;
}

export { lengthOfLongestSubstring };
