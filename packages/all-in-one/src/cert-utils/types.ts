import type { pki } from 'node-forge';

export type CertificateInfo = {
  cert: pki.Certificate;
  key: pki.rsa.PrivateKey;
};

export type CertificatePemInfo = {
  cert: string;
  key: string;
};
