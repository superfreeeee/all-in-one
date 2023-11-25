import { pki } from 'node-forge';
import type { CertificateInfo, CertificatePemInfo } from './types';

/**
 * Transform CertificateInfo to pem
 * @param certificate
 * @returns
 */
export const certificateToPem = (certificate: CertificateInfo): CertificatePemInfo => {
  return {
    cert: pki.certificateToPem(certificate.cert),
    key: pki.privateKeyToPem(certificate.key),
  };
};

/**
 * Get CertificateInfo from pem
 * @param pemCert
 * @returns
 */
export const certificateFromPem = (pemCert: CertificatePemInfo): CertificateInfo => {
  return {
    cert: pki.certificateFromPem(pemCert.cert),
    key: pki.privateKeyFromPem(pemCert.key),
  };
};
