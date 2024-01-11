function strStr(haystack: string, needle: string): number {
  // return strStr_1(haystack, needle);
  return strStr_2(haystack, needle);
}

/**
 * KMP algorithm
 * @param haystack
 * @param needle
 * @returns
 */
function strStr_2(haystack: string, needle: string): number {
  if (needle === '') {
    return 0;
  }

  const m = haystack.length;
  const n = needle.length;
  const next: number[] = [0, 0];

  // 构造 next 数组
  for (let i = 1, j = 0, i2 = n - 1; i < i2; i++) {
    while (j > 0 && needle[i] != needle[j]) {
      j = next[j] || 0;
    }
    if (needle[i] == needle[j]) {
      j += 1;
    }
    next[i + 1] = j;
  }

  // 匹配原数组
  for (let i = 0, j = 0; i < m; i++) {
    while (j > 0 && haystack[i] != needle[j]) {
      j = next[j] || 0;
    }
    if (haystack[i] == needle[j]) {
      j += 1;
    }
    if (j == n) {
      return i - n + 1;
    }
  }

  return -1;
}

/**
 * use String.prototype.indexOf
 * @param haystack
 * @param needle
 * @returns
 */
function strStr_1(haystack: string, needle: string): number {
  return haystack.indexOf(needle);
}

export { strStr };
