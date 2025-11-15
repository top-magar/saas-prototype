import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSubdomain } from '@/lib/tenant';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json({ available: false, reason: 'Invalid subdomain format' });
    }

    const { data } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    return NextResponse.json({ available: !data });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}