import { pki, md } from 'node-forge';
import { createCert } from './createCert';
import type { CertificateInfo } from './types';

type CreateCACertOptions = {
  name: string;
  country: string;
  stateOrProvince: string;
  locality: string;
  organization: string;
  organizationalUnit: string;
};

/**
 * Create CA Certificate
 * @returns
 */
export const createCACert = (options: CreateCACertOptions): CertificateInfo => {
  const keys = pki.rsa.generateKeyPair(2048);

  const cert = createCert(keys.publicKey);
  const attrs: pki.CertificateField[] = [
    {
      // CA name
      name: 'commonName',
      value: options.name,
    },
    {
      // cert country
      name: 'countryName',
      value: options.country,
    },
    {
      shortName: 'ST', // stateOrProvinceName
      value: options.stateOrProvince,
    },
    {
      name: 'localityName',
      value: options.locality,
    },
    {
      name: 'organizationName',
      value: options.organization,
    },
    {
      shortName: 'OU',
      value: options.organizationalUnit,
    },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  const exts = [
    {
      name: 'basicConstraints',
      cA: true,
    },
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

  cert.sign(keys.privateKey, md.sha256.create());

  return {
    cert: cert,
    key: keys.privateKey,
  };
};
