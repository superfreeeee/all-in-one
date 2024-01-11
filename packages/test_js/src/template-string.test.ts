test('tagged', () => {
  const func = (strs: TemplateStringsArray, ...values: unknown[]) => {
    console.log(strs, ...values);
  };

  // output: [ 'template: ', ' + ', ' = ', '' ] 1 1 2
  func`template: ${1} + ${1} = ${1 + 1}`;
});
