import { randomBytes } from 'crypto';

export function generateVerificationToken(): string {
  const token = randomBytes(32).toString('hex');
  return `vc-domain-verify=${token}`;
}

export function extractTokenValue(fullToken: string): string {
  return fullToken.replace('vc-domain-verify=', '');
}

export function formatTXTRecord(domain: string, token: string): {
  host: string;
  type: string;
  value: string;
} {
  return {
    host: `_verify-domain.${domain}`,
    type: 'TXT',
    value: token,
  };
}
