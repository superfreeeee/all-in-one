import { createCACert } from '../createCACert';
import { certificateFromPem, certificateToPem } from '../pemUtils';

test('pemUtils test', () => {
  const certificate = createCACert({ commonName: 'YouxianProxy' });

  const pem = certificateToPem(certificate);
  expect(typeof pem.cert).toBe('string');
  expect(typeof pem.key).toBe('string');

  const cert = certificateFromPem(pem);
  expect(cert.cert).toBeDefined();
  expect(cert.key).toBeDefined();
});
