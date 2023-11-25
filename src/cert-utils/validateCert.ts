import crypto from 'crypto';
import { CertificatePemInfo } from './types';

export const validateCert = ({ cert, key }: CertificatePemInfo) => {
  const TEST_STR = 'hello world';
  const encrypted = crypto.publicEncrypt(cert, Buffer.from(TEST_STR));
  const decrypted = crypto.privateDecrypt(key, encrypted);
  return decrypted.toString() === TEST_STR;
};
