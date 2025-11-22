import { NextResponse } from 'next/server';
import { isRedisAvailable } from '@/lib/cache/upstash-client';

export async function GET() {
  return NextResponse.json({
    redis: {
      available: isRedisAvailable(),
      status: isRedisAvailable() ? 'connected' : 'disabled',
    },
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE() {
  return NextResponse.json({
    success: true,
    message: 'Cache metrics reset',
  });
}
