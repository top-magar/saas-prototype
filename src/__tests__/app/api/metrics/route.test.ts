import { GET } from '@/app/api/metrics/route';
import { MetricsCollector } from '@/lib/monitoring/metrics';

jest.mock('@/lib/monitoring/metrics');

describe('Metrics API', () => {
  it('returns metrics data', async () => {
    const mockMetrics = { 'test.metric': { avg: 100, min: 50, max: 150, count: 10 } };
    (MetricsCollector.getInstance as jest.Mock).mockReturnValue({
      getMetrics: jest.fn().mockReturnValue(mockMetrics),
    });

    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.metrics).toEqual(mockMetrics);
    expect(data.timestamp).toBeDefined();
  });
});
