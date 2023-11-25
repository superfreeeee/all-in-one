import { createCACert } from '../createCACert';

describe('createCACert tests', () => {
  test('create success', () => {
    const certificate = createCACert({
      name: 'YouxianProxy',
      country: 'CN',
      stateOrProvince: 'ZJ',
      locality: 'HZ',
      organization: 'youxian.org',
      organizationalUnit: 'youxian-proxy',
    });

    expect(certificate).toBeDefined();
  });
});
