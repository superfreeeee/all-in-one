import { createCACert } from '../createCACert';

describe('createCACert tests', () => {
  test('create success', () => {
    const certificate = createCACert({ commonName: 'YouxianProxy' });
    expect(certificate).toBeDefined();
  });
});
