import crypto from 'crypto';
import net from 'net';
import { md, pki } from 'node-forge';
import { createCert } from './createCert';
import { CertificateInfo } from './types';

let domainCertId = 0;
const nextDomainCertId = () => {
  domainCertId += 1;
  if (domainCertId < 10) {
    return `0${domainCertId}`;
  }
  if (domainCertId > 99) {
    domainCertId = 0;
    return '00';
  }
  return `${domainCertId}`;
};

/**
 *
 * @param hostname
 * @returns
 */
const createDomainSerialNumber = (hostname: string) => {
  const randomSerial = `.${Date.now()}.${Math.floor(Math.random() * 10000)}`;
  const hash = crypto
    .createHash('sha1') //
    .update(`${hostname}${randomSerial}binary`)
    .digest('hex');
  return `${hash}${nextDomainCertId()}`;
};

/**
 * Create Domain Certificate
 * @param rootCA
 * @param hostname
 * @returns
 */
export const createDomainCert = (rootCA: CertificateInfo, hostname: string): CertificateInfo => {
  const serialNumber = createDomainSerialNumber(hostname);

  const domainCert = createCert(
    pki.setRsaPublicKey(rootCA.key.n, rootCA.key.e), //
    serialNumber,
  );

  domainCert.setSubject([
    {
      name: 'commonName',
      value: hostname,
    },
  ]);
  domainCert.setIssuer(rootCA.cert.subject.attributes);
  domainCert.setExtensions([
    {
      name: 'subjectAltName',
      altNames: [
        net.isIP(hostname)
          ? {
              type: 7,
              ip: hostname,
            }
          : {
              type: 2,
              value: hostname,
            },
      ],
    },
  ]);

  domainCert.sign(rootCA.key, md.sha256.create());

  return { cert: domainCert, key: rootCA.key };
};
