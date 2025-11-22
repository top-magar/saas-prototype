import { DomainStatus } from './types';

export async function checkDNSRecords(domain: string): Promise<DomainStatus['dns']> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const aData = await response.json();
    
    const cnameResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`);
    const cnameData = await cnameResponse.json();
    
    const txtResponse = await fetch(`https://dns.google/resolve?name=_vercel.${domain}&type=TXT`);
    const txtData = await txtResponse.json();

    return {
      aRecords: aData.Answer?.map((a: any) => a.data) || [],
      cnameRecords: cnameData.Answer?.map((c: any) => c.data) || [],
      txtRecords: txtData.Answer?.map((t: any) => t.data) || [],
    };
  } catch (error) {
    console.error('[DNS] Check error:', error);
    return { aRecords: [], cnameRecords: [], txtRecords: [] };
  }
}

export function generateVerificationToken(): string {
  return `vc-domain-verify=${crypto.randomUUID().replace(/-/g, '')}`;
}
