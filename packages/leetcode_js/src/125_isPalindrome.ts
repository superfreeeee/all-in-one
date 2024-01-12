// paste question code here
function isPalindrome(s: string): boolean {
  const s1 = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = s1.split('').reverse().join('');
  return s1 === s2;
}

function isPalindrome_1(s: string): boolean {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.length <= 1) {
    return true;
  }
  console.log({ s });
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) {
      return false;
    }
  }
  return true;
}

// generate by ../generate.js
export { isPalindrome };
