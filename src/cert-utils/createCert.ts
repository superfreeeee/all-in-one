import { pki } from 'node-forge';

/**
 * Create basic TLS Certificate
 *
 * @description
 * setting following attrs
 * - publicKey
 * - serialNumber
 * - validity.notBefore
 * - validity.notAfter
 *
 * @param publicKey
 * @param serialNumber
 * @returns
 */
export const createCert = (publicKey: pki.PublicKey, serialNumber?: string): pki.Certificate => {
  const cert = pki.createCertificate();
  cert.publicKey = publicKey;
  cert.serialNumber = serialNumber || '01';

  const curDate = new Date();
  const curYear = curDate.getFullYear();

  /**
   * validity time set: -1 ~ +10 years
   */
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setFullYear(curYear - 1);

  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(curYear + 10);
  return cert;
};
