import { createCACert } from '../createCACert';
import { createDomainCert } from '../createDomainCert';
import { certificateToPem } from '../pemUtils';
import { validateCert } from '../validateCert';

test('validateCert test', () => {
  const rootCA = createCACert({ commonName: 'YouxianProxy' });
  const domainCert = createDomainCert(rootCA, 'localhost');
  const domainCertPem = certificateToPem(domainCert);

  const res = validateCert(domainCertPem);
  expect(res).toBe(true);
});
