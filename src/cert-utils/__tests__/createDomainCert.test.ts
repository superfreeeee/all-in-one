import { createCACert } from '../createCACert';
import { createDomainCert } from '../createDomainCert';

describe('createDomainCert tests', () => {
  test('create success', () => {
    const rootCA = createCACert({
      name: 'YouxianProxy',
      country: 'CN',
      stateOrProvince: 'ZJ',
      locality: 'HZ',
      organization: 'youxian.org',
      organizationalUnit: 'youxian-proxy',
    });

    const domainCert = createDomainCert(rootCA, 'localhost');
    expect(domainCert).toBeDefined();
  });

  test('domainId overflow', () => {
    const rootCA = createCACert({
      name: 'YouxianProxy',
      country: 'CN',
      stateOrProvince: 'ZJ',
      locality: 'HZ',
      organization: 'youxian.org',
      organizationalUnit: 'youxian-proxy',
    });

    const createCert = () => createDomainCert(rootCA, 'localhost');
    for (let i = 0; i < 100; i++) {
      createCert();
    }

    const domainCert = createCert();
    expect(domainCert).toBeDefined();
  });
});
