import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/database/connection-pool';
import { getRedisClient } from '@/lib/cache/redis';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbHealthy = await checkDatabaseHealth();
    
    // Check Redis connectivity
    let redisHealthy = true;
    try {
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
      }
    } catch {
      redisHealthy = false;
    }
    
    const responseTime = Date.now() - startTime;
    const isHealthy = dbHealthy && redisHealthy;
    
    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        redis: redisHealthy ? 'up' : 'down',
      },
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
    };
    
    return NextResponse.json(healthStatus, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}