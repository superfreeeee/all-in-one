import crypto from 'crypto';
import { CertificatePemInfo } from './types';

/**
 * Validate certificate with publicKey & privateKey pair
 * @param param0
 * @returns
 */
export const validateCert = ({ cert, key }: CertificatePemInfo) => {
  const TEST_STR = 'hello world';
  const encrypted = crypto.publicEncrypt(cert, Buffer.from(TEST_STR));
  const decrypted = crypto.privateDecrypt(key, encrypted);
  return decrypted.toString() === TEST_STR;
};
