import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from "@/lib/database/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('*, tenant:tenants(*)')
      .eq('email', session.user.email)
      .single();

    if (!dbUser || !dbUser.tenant) {
      return NextResponse.json({ tenant: null });
    }

    return NextResponse.json({ tenant: dbUser.tenant });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}