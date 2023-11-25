import { createCACert } from '../createCACert';
import { createDomainCert } from '../createDomainCert';
import { certificateToPem } from '../pemUtils';
import { validateCert } from '../validateCert';

test('validateCert test', () => {
  const rootCA = createCACert({
    name: 'YouxianProxy',
    country: 'CN',
    stateOrProvince: 'ZJ',
    locality: 'HZ',
    organization: 'youxian.org',
    organizationalUnit: 'youxian-proxy',
  });
  const domainCert = createDomainCert(rootCA, 'localhost');
  const domainCertPem = certificateToPem(domainCert);

  const res = validateCert(domainCertPem);
  expect(res).toBe(true);
});
