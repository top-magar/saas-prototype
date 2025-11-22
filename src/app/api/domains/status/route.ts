import { NextRequest, NextResponse } from 'next/server';
import { DomainStatusSchema, DomainStatus } from '@/lib/domains/types';
import { getDomainConfig, isVercelConfigured } from '@/lib/domains/vercel';
import { checkDNSRecords } from '@/lib/domains/dns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    const validation = DomainStatusSchema.safeParse({ domain });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid domain parameter' },
        { status: 400 }
      );
    }

    const { domain: validDomain } = validation.data;

    // Check DNS records
    const dns = await checkDNSRecords(validDomain);

    let verified = false;
    let configured = false;
    let sslStatus: DomainStatus['ssl'] = { status: 'pending' };

    // Check Vercel configuration if available
    if (isVercelConfigured()) {
      try {
        const config = await getDomainConfig(validDomain);
        verified = config.verified;
        configured = !config.misconfigured;
        
        // SSL status is typically active if domain is verified and configured
        if (verified && configured) {
          sslStatus = { status: 'active' };
        }
      } catch (error: any) {
        console.error('[Domain] Status check error:', error);
        // Continue with DNS-only status
      }
    }

    const status: DomainStatus = {
      domain: validDomain,
      verified,
      configured,
      ssl: sslStatus,
      dns,
    };

    return NextResponse.json(status);

  } catch (error) {
    console.error('[Domain] Status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
