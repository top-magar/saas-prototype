/**
 * @jest-environment node
 */
import { GET, POST } from '../../../../app/api/products/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('../../../../lib/server/auth', () => ({
    authorize: jest.fn(),
}));

jest.mock('../../../../lib/services/product.service', () => ({
    productService: {
        listProducts: jest.fn(),
        getProduct: jest.fn(),
        createProduct: jest.fn(),
    },
}));

import { authorize } from '../../../../lib/server/auth';
import { productService } from '../../../../lib/services/product.service';

describe('Products API', () => {
    const mockTenantId = 'tenant-123';
    const mockUserId = 'user-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 400 if tenantId is missing', async () => {
            const req = new NextRequest('http://localhost/api/products');
            const res = await GET(req);
            expect(res.status).toBe(400);
            expect(await res.text()).toBe('Tenant ID is required');
        });

        it('should return 403 if not authorized', async () => {
            (authorize as jest.Mock).mockRejectedValue(new Error('Forbidden: User does not belong to this tenant'));

            const req = new NextRequest(`http://localhost/api/products?tenantId=${mockTenantId}`);
            const res = await GET(req);

            expect(res.status).toBe(403);
        });

        it('should return list of products', async () => {
            (authorize as jest.Mock).mockResolvedValue({ id: mockUserId });
            (productService.listProducts as jest.Mock).mockResolvedValue({ products: [], pagination: {} });

            const req = new NextRequest(`http://localhost/api/products?tenantId=${mockTenantId}`);
            const res = await GET(req);

            expect(res.status).toBe(200);
            expect(await res.json()).toEqual({ products: [], pagination: {} });
            expect(authorize).toHaveBeenCalledWith(mockTenantId, ['admin', 'manager', 'user']);
        });

        it('should return single product if productId is provided', async () => {
            (authorize as jest.Mock).mockResolvedValue({ id: mockUserId });
            const mockProduct = { id: 'prod-1', name: 'Test Product' };
            (productService.getProduct as jest.Mock).mockResolvedValue(mockProduct);

            const req = new NextRequest(`http://localhost/api/products?tenantId=${mockTenantId}&productId=prod-1`);
            const res = await GET(req);

            expect(res.status).toBe(200);
            expect(await res.json()).toEqual(mockProduct);
        });
    });

    describe('POST', () => {
        it('should return 400 if tenantId is missing', async () => {
            const req = new NextRequest('http://localhost/api/products', {
                method: 'POST',
                body: JSON.stringify({}),
            });
            const res = await POST(req);
            expect(res.status).toBe(400);
        });

        it('should create product on valid data', async () => {
            (authorize as jest.Mock).mockResolvedValue({ userId: mockUserId });
            const newProduct = { name: 'New Product', price: 100 };
            (productService.createProduct as jest.Mock).mockResolvedValue({ id: 'prod-new', ...newProduct });

            const req = new NextRequest(`http://localhost/api/products?tenantId=${mockTenantId}`, {
                method: 'POST',
                body: JSON.stringify(newProduct),
            });
            const res = await POST(req);

            expect(res.status).toBe(201);
            expect(await res.json()).toEqual({ id: 'prod-new', ...newProduct });
            expect(productService.createProduct).toHaveBeenCalledWith(expect.objectContaining({
                tenantId: mockTenantId,
                userId: mockUserId,
                name: 'New Product',
            }));
        });

        it('should return 400 on validation error', async () => {
            (authorize as jest.Mock).mockResolvedValue({ userId: mockUserId });

            // Missing name
            const req = new NextRequest(`http://localhost/api/products?tenantId=${mockTenantId}`, {
                method: 'POST',
                body: JSON.stringify({ description: 'No name' }),
            });
            const res = await POST(req);

            expect(res.status).toBe(400);
        });
    });
});
