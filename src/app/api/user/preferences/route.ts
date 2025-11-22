import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/database/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('language, timezone, currency_code')
            .eq('email', session.user.email)
            .single();

        if (error) {
            console.error('Error fetching preferences:', error);
            return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
        }

        return NextResponse.json({
            language: user?.language || 'en',
            timezone: user?.timezone || 'Asia/Kathmandu',
            currency: user?.currency_code || 'NPR'
        });
    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { language, timezone, currency } = body;

        const updates: any = {};
        if (language) updates.language = language;
        if (timezone) updates.timezone = timezone;
        if (currency) updates.currency_code = currency;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No changes provided' });
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .update(updates)
            .eq('email', session.user.email)
            .select('language, timezone, currency_code')
            .single();

        if (error) {
            console.error('Error updating preferences:', error);
            return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
        }

        return NextResponse.json({
            language: user?.language,
            timezone: user?.timezone,
            currency: user?.currency_code
        });
    } catch (error) {
        console.error('Internal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
