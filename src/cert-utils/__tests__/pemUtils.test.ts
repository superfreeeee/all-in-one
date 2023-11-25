import { createCACert } from '../createCACert';
import { certificateFromPem, certificateToPem } from '../pemUtils';

const createCert = () =>
  createCACert({
    name: 'YouxianProxy',
    country: 'CN',
    stateOrProvince: 'ZJ',
    locality: 'HZ',
    organization: 'youxian.org',
    organizationalUnit: 'youxian-proxy',
  });

test('pemUtils test', () => {
  const certificate = createCert();

  const pem = certificateToPem(certificate);
  expect(typeof pem.cert).toBe('string');
  expect(typeof pem.key).toBe('string');

  const cert = certificateFromPem(pem);
  expect(cert.cert).toBeDefined();
  expect(cert.key).toBeDefined();
});
