import { POST } from '@/app/api/tenants/route';
import { NextRequest } from 'next/server';

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
}));

jest.mock('@/lib/database/tenant', () => ({
  createTenantAndAssociateUser: jest.fn(),
}));

jest.mock('@/lib/server/api-helpers', () => ({
  createErrorResponse: jest.fn((msg, status) => new Response(JSON.stringify({ error: msg }), { status })),
  createSuccessResponse: jest.fn((data) => new Response(JSON.stringify(data), { status: 200 })),
  validateRequest: jest.fn(async (req, fields) => {
    const body = await req.json();
    return body;
  }),
}));

describe('Tenants API', () => {
  it('creates tenant for authenticated user', async () => {
    const { currentUser } = require('@clerk/nextjs/server');
    const { createTenantAndAssociateUser } = require('@/lib/database/tenant');
    
    currentUser.mockResolvedValue({
      id: 'user-123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'John',
    });
    
    createTenantAndAssociateUser.mockResolvedValue({ id: 'tenant-123', name: 'Test' });
    
    const request = new NextRequest('http://localhost/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', subdomain: 'test' }),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it('rejects unauthenticated requests', async () => {
    const { currentUser } = require('@clerk/nextjs/server');
    currentUser.mockResolvedValue(null);
    
    const request = new NextRequest('http://localhost/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', subdomain: 'test' }),
    });
    
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
