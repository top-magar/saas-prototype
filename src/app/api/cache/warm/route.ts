import { NextResponse } from 'next/server';
import { warmAllTenants } from '@/lib/cache/cache-warming';

export async function POST() {
  const result = await warmAllTenants();
  
  if (result.success) {
    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully warmed ${result.count} cache entries`,
    });
  }
  
  return NextResponse.json({
    success: false,
    error: result.error,
  }, { status: 500 });
}
