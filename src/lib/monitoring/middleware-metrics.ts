import * as Sentry from '@sentry/nextjs';

interface MetricData {
  duration: number;
  cached: boolean;
  tenantType: 'subdomain' | 'custom' | 'root';
  success: boolean;
}

export function trackTenantResolution(data: MetricData) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.distribution('tenant.resolution.duration', data.duration);
  }
}

export function trackCacheHit(hit: boolean, identifier: string) {
  // Sentry metrics API doesn't currently support increment in this version
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.metrics.increment('tenant.cache.hit', 1);
  // }
}

export function logTenantError(error: Error, context: Record<string, any>) {
  console.error('[Tenant Resolution Error]', error, context);

  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { component: 'middleware', type: 'tenant_resolution' },
      extra: context,
    });
  }
}
