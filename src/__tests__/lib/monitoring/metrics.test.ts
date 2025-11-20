import { MetricsCollector } from '@/lib/monitoring/metrics';

describe('MetricsCollector', () => {
  let metrics: MetricsCollector;

  beforeEach(() => {
    metrics = MetricsCollector.getInstance();
  });

  it('records metric', () => {
    metrics.recordMetric('test.metric', 100);
    const result = metrics.getMetrics();
    expect(result['test.metric']).toBeDefined();
    expect(result['test.metric'].avg).toBe(100);
  });

  it('calculates statistics', () => {
    metrics.recordMetric('test.stats', 10);
    metrics.recordMetric('test.stats', 20);
    metrics.recordMetric('test.stats', 30);
    
    const result = metrics.getMetrics();
    expect(result['test.stats'].avg).toBe(20);
    expect(result['test.stats'].min).toBe(10);
    expect(result['test.stats'].max).toBe(30);
    expect(result['test.stats'].count).toBe(3);
  });

  it('tracks query performance', async () => {
    const queryFn = jest.fn().mockResolvedValue('result');
    const result = await metrics.trackQuery('test.query', queryFn);
    
    expect(result).toBe('result');
    expect(queryFn).toHaveBeenCalled();
  });

  it('tracks API calls', () => {
    metrics.trackApiCall('test.endpoint', 150, 200);
    const result = metrics.getMetrics();
    
    expect(result['api.test.endpoint.duration']).toBeDefined();
    expect(result['api.test.endpoint.status.200']).toBeDefined();
  });
});
