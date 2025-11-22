/**
 * @jest-environment node
 */
import { GET, POST } from '../../../../app/api/orders/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('../../../../lib/server/auth', () => ({
    authorize: jest.fn(),
}));

jest.mock('../../../../lib/database/customers', () => ({
    findOrCreateCustomer: jest.fn(),
}));

jest.mock('../../../../lib/database/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

import { authorize } from '../../../../lib/server/auth';
import { findOrCreateCustomer } from '../../../../lib/database/customers';
import { supabase } from '../../../../lib/database/supabase';

describe('Orders API', () => {
    const mockTenantId = 'tenant-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 400 if tenantId is missing', async () => {
            const req = new NextRequest('http://localhost:3000/api/orders');
            const res = await GET(req);
            expect(res.status).toBe(400);
            expect(await res.text()).toBe('Tenant ID is required');
        });

        it('should return 401/403 if authorization fails', async () => {
            (authorize as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

            const req = new NextRequest(`http://localhost:3000/api/orders?tenantId=${mockTenantId}`);
            const res = await GET(req);

            expect(res.status).toBe(401);
            expect(await res.text()).toBe('Unauthorized');
        });

        it('should return orders on success', async () => {
            (authorize as jest.Mock).mockResolvedValue(true);

            const mockOrders = [{ id: 1, order_number: 'ORD-1' }];
            const mockSelect = jest.fn().mockReturnThis();
            const mockEq = jest.fn().mockReturnThis();
            const mockOrder = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockResolvedValue({ data: mockOrders });

            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });
            mockSelect.mockReturnValue({
                eq: mockEq,
            });
            mockEq.mockReturnValue({
                order: mockOrder,
            });
            mockOrder.mockReturnValue({
                limit: mockLimit,
            });

            const req = new NextRequest(`http://localhost:3000/api/orders?tenantId=${mockTenantId}`);
            const res = await GET(req);

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual(mockOrders);
            expect(supabase.from).toHaveBeenCalledWith('orders');
            expect(mockEq).toHaveBeenCalledWith('tenant_id', mockTenantId);
        });
    });

    describe('POST', () => {
        const validBody = {
            tenantId: mockTenantId,
            customerEmail: 'test@example.com',
            customerName: 'Test User',
            customerPhone: '1234567890',
            items: [{ id: 1, quantity: 1 }],
            total: 100,
            paymentMethod: 'card'
        };

        it('should return 400 if required fields are missing', async () => {
            const req = new NextRequest('http://localhost:3000/api/orders', {
                method: 'POST',
                body: JSON.stringify({ tenantId: mockTenantId }), // Missing other fields
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
            expect(await res.text()).toBe('Missing required fields');
        });

        it('should create an order successfully', async () => {
            const mockCustomer = { id: 'cust-1', name: 'Test User' };
            (findOrCreateCustomer as jest.Mock).mockResolvedValue(mockCustomer);

            // Mock count query
            const mockCountSelect = jest.fn().mockReturnThis();
            const mockCountEq = jest.fn().mockResolvedValue({ count: 5 });

            // Mock insert query
            const mockInsert = jest.fn().mockReturnThis();
            const mockInsertSelect = jest.fn().mockReturnThis();
            const mockInsertSingle = jest.fn().mockResolvedValue({ data: { id: 'order-1', order_number: 'ORD-NEW' } });

            (supabase.from as jest.Mock).mockImplementation((table) => {
                if (table === 'orders') {
                    return {
                        select: mockCountSelect,
                        insert: mockInsert,
                    };
                }
                return {};
            });

            mockCountSelect.mockReturnValue({ eq: mockCountEq });
            mockInsert.mockReturnValue({ select: mockInsertSelect });
            mockInsertSelect.mockReturnValue({ single: mockInsertSingle });

            const req = new NextRequest('http://localhost:3000/api/orders', {
                method: 'POST',
                body: JSON.stringify(validBody),
            });
            const res = await POST(req);

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data.customer).toEqual(mockCustomer);
            expect(data.order).toBeDefined();

            expect(findOrCreateCustomer).toHaveBeenCalledWith(expect.objectContaining({
                email: validBody.customerEmail,
                tenantId: mockTenantId
            }));

            expect(supabase.from).toHaveBeenCalledWith('orders');
            expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
                tenantId: mockTenantId,
                user_id: mockCustomer.id,
                total: validBody.total
            }));
        });
    });
});
