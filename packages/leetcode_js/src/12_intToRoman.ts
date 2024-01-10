const filterMapper = [
  { value: 1000, str: 'M' },
  { value: 900, str: 'CM' },
  { value: 500, str: 'D' },
  { value: 400, str: 'CD' },
  { value: 100, str: 'C' },
  { value: 90, str: 'XC' },
  { value: 50, str: 'L' },
  { value: 40, str: 'XL' },
  { value: 10, str: 'X' },
  { value: 9, str: 'IX' },
  { value: 5, str: 'V' },
  { value: 4, str: 'IV' },
  { value: 1, str: 'I' },
];

function intToRoman(num: number): string {
  let s = '';
  for (const { value, str } of filterMapper) {
    while (num >= value) {
      s += str;
      num -= value;
    }
  }
  return s;
}

export { intToRoman };
