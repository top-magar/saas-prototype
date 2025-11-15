import { NextResponse } from 'next/server';
import { MetricsCollector } from '@/lib/monitoring/metrics';

export async function GET() {
  try {
    const metrics = MetricsCollector.getInstance();
    const data = metrics.getMetrics();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}