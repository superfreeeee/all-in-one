// paste question code here
const map: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
};

function isValid(s: string): boolean {
  if (s.length & 1) return false;
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else if (stack.length === 0 || s[i] !== map[stack.pop() as string]) {
      return false;
    }
  }
  return stack.length === 0;
}

// generate by ../generate.js
export { isValid };
