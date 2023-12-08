import { createCACert } from '../createCACert';
import { createDomainCert } from '../createDomainCert';

describe('createDomainCert tests', () => {
  test('domain host', () => {
    const rootCA = createCACert({ commonName: 'YouxianProxy' });
    const domainCert = createDomainCert(rootCA, 'localhost');
    expect(domainCert).toBeDefined();
  });

  test('ip host', () => {
    const rootCA = createCACert({ commonName: 'YouxianProxy' });
    const domainCert = createDomainCert(rootCA, '127.0.0.1');
    expect(domainCert).toBeDefined();
  });

  test('domainId overflow', () => {
    const rootCA = createCACert({ commonName: 'YouxianProxy' });

    const createCert = () => createDomainCert(rootCA, 'localhost');
    for (let i = 0; i < 100; i++) {
      createCert();
    }

    const domainCert = createCert();
    expect(domainCert).toBeDefined();
  });
});
