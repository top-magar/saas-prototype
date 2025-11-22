import { promises as dns } from 'dns';

export interface DNSVerificationResult {
  verified: boolean;
  records: string[];
  error?: string;
  propagated: boolean;
}

export async function verifyDNSTXTRecord(
  domain: string,
  expectedToken: string,
  retries = 3
): Promise<DNSVerificationResult> {
  const verificationHost = `_verify-domain.${domain}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const records = await dns.resolveTxt(verificationHost);
      const flatRecords = records.flat();
      
      const verified = flatRecords.some(record => 
        record.includes(expectedToken) || record === expectedToken
      );

      return {
        verified,
        records: flatRecords,
        propagated: flatRecords.length > 0,
      };
    } catch (error: any) {
      if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
        if (attempt === retries) {
          return {
            verified: false,
            records: [],
            error: 'DNS record not found. Please ensure TXT record is added.',
            propagated: false,
          };
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      return {
        verified: false,
        records: [],
        error: `DNS lookup failed: ${error.message}`,
        propagated: false,
      };
    }
  }

  return {
    verified: false,
    records: [],
    error: 'Verification failed after retries',
    propagated: false,
  };
}

export async function checkDNSPropagation(domain: string): Promise<{
  propagated: boolean;
  nameservers: string[];
}> {
  try {
    const nameservers = await dns.resolveNs(domain);
    return {
      propagated: nameservers.length > 0,
      nameservers,
    };
  } catch {
    return {
      propagated: false,
      nameservers: [],
    };
  }
}

export function getDNSErrorMessage(error?: string): string {
  if (!error) return '';
  
  if (error.includes('ENOTFOUND') || error.includes('not found')) {
    return 'DNS record not found. It may take up to 48 hours for DNS changes to propagate globally.';
  }
  
  if (error.includes('ENODATA')) {
    return 'No TXT records found for this domain. Please add the verification record.';
  }
  
  if (error.includes('ETIMEOUT')) {
    return 'DNS lookup timed out. Please try again in a few minutes.';
  }
  
  return 'DNS verification failed. Please check your DNS configuration.';
}
