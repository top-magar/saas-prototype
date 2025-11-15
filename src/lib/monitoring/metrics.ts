// Performance metrics collection
export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      }
    }
    
    return result;
  }

  // Database query performance tracking
  async trackQuery<T>(name: string, queryFn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await queryFn();
      this.recordMetric(`db.${name}`, Date.now() - start);
      return result;
    } catch (error) {
      this.recordMetric(`db.${name}.error`, Date.now() - start);
      throw error;
    }
  }

  // API endpoint performance tracking
  trackApiCall(endpoint: string, duration: number, status: number): void {
    this.recordMetric(`api.${endpoint}.duration`, duration);
    this.recordMetric(`api.${endpoint}.status.${status}`, 1);
  }
}