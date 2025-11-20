# Testing Guide

## Overview

The project uses Jest and React Testing Library for comprehensive testing with 80%+ coverage target.

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Test Structure

```
src/__tests__/
├── app/api/          # API route tests
├── components/       # Component tests
└── lib/              # Utility tests
    ├── cache/        # Redis cache tests
    ├── database/     # Database tests
    ├── monitoring/   # Metrics tests
    ├── security/     # Security tests
    └── shared/       # Shared utility tests
```

## Coverage Thresholds

Current thresholds (enforced):
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## Writing Tests

### API Routes
```typescript
import { GET } from '@/app/api/endpoint/route';

describe('API Endpoint', () => {
  it('returns expected data', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });
});
```

### Utilities
```typescript
import { myFunction } from '@/lib/utils';

describe('myFunction', () => {
  it('handles input correctly', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### Components
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Mocking

### Supabase
```typescript
jest.mock('@/lib/database/connection-pool', () => ({
  supabaseServerClient: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));
```

### Redis
```typescript
jest.mock('@/lib/cache/redis', () => ({
  cacheGet: jest.fn().mockResolvedValue(null),
  cacheSet: jest.fn().mockResolvedValue(undefined),
}));
```

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Before deployment

Failed tests block deployment.
