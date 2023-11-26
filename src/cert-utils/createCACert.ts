import { pki, md } from 'node-forge';
import { createCert } from './createCert';
import type { CertificateInfo } from './types';

type CreateCACertOptions = {
  commonName: string;
  countryName?: string;
  stateOrProvinceName?: string;
  localityName?: string;
  organizationName?: string;
  organizationalUnit?: string;
};

const DEFAULT_OPTIONS: Required<Omit<CreateCACertOptions, 'commonName'>> = {
  countryName: 'CN',
  stateOrProvinceName: 'ZJ',
  localityName: 'HZ',
  organizationName: 'youxian.org',
  organizationalUnit: 'ssl.youxian.org',
};

/**
 * Create CA Certificate
 * @returns
 */
export const createCACert = (options: CreateCACertOptions): CertificateInfo => {
  const keys = pki.rsa.generateKeyPair(2048);
  const cert = createCert(keys.publicKey);
  // set attrs
  const normalizedOptions = { ...DEFAULT_OPTIONS, ...options };
  const attrs: pki.CertificateField[] = [
    // CA name
    { name: 'commonName', value: normalizedOptions.commonName },
    // cert country
    { name: 'countryName', value: normalizedOptions.countryName },
    // stateOrProvinceName
    { shortName: 'ST', value: normalizedOptions.stateOrProvinceName },
    // localityName
    { name: 'localityName', value: normalizedOptions.localityName },
    // organizationName
    { name: 'organizationName', value: normalizedOptions.organizationName },
    // organizationalUnit
    { shortName: 'OU', value: normalizedOptions.organizationalUnit },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  // set extensions
  const exts = [
    // CA constraints
    { name: 'basicConstraints', cA: true },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true,
    },
    {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true,
    },
  ];
  cert.setExtensions(exts);

  // sign
  cert.sign(keys.privateKey, md.sha256.create());

  return { cert, key: keys.privateKey };
};
