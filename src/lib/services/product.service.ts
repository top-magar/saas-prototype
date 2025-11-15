import { supabase } from '@/lib/supabase';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

interface CreateProductData {
  tenantId: string;
  userId: string;
  name: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryIds?: string[];
  mediaUrls?: { url: string; altText?: string; order?: number }[];
  options?: { name: string; values: string[] }[];
  variants?: {
    sku?: string;
    price: number;
    stock: number;
    optionValues: { optionName: string; value: string }[];
  }[];
}

export class ProductService {
  async createProduct(data: CreateProductData) {
    const { tenantId, userId, name, description, status, categoryIds, mediaUrls, options, variants } = data;
    const slug = generateSlug(name);

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenantId,
        name,
        slug,
        description,
        status: status || 'DRAFT',
      })
      .select()
      .single();

    if (error) throw new Error('Failed to create product');

    if (mediaUrls && mediaUrls.length > 0) {
      await supabase
        .from('media')
        .insert(
          mediaUrls.map((media, index) => ({
            product_id: product.id,
            url: media.url,
            alt_text: media.altText,
            order: media.order !== undefined ? media.order : index,
          }))
        );
    }

    if (categoryIds && categoryIds.length > 0) {
      await supabase
        .from('product_categories')
        .insert(
          categoryIds.map(categoryId => ({
            product_id: product.id,
            category_id: categoryId,
          }))
        );
    }

    return product;
  }

  async updateProduct(productId: string, data: Partial<CreateProductData>) {
    const { tenantId, name, description, status } = data;
    const slug = name ? generateSlug(name) : undefined;

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        slug,
        description,
        status,
      })
      .eq('id', productId)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw new Error('Failed to update product');
    return product;
  }

  async deleteProduct(productId: string, tenantId: string, userId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('tenant_id', tenantId);

    if (error) throw new Error('Failed to delete product');
    return { success: true };
  }

  async getProduct(productId: string, tenantId: string) {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        media(*),
        product_categories(category_id, categories(id, name, description)),
        product_variants(*)
      `)
      .eq('id', productId)
      .eq('tenant_id', tenantId)
      .single();

    if (error) return null;
    return product;
  }

  async listProducts(
    tenantId: string,
    searchTerm?: string,
    categoryId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    let query = supabase
      .from('products')
      .select(`
        *,
        media(id, url, alt_text, "order"),
        product_categories(categories(id, name)),
        product_variants(id, price, quantity)
      `)
      .eq('tenant_id', tenantId);

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (categoryId) {
      query = query.eq('product_categories.category_id', categoryId);
    }

    const { data: products, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('updated_at', { ascending: false });

    if (error) throw new Error('Failed to fetch products');

    return {
      products: products || [],
      pagination: {
        page,
        limit,
        total: products?.length || 0,
        totalPages: Math.ceil((products?.length || 0) / limit),
        hasNext: (products?.length || 0) === limit,
        hasPrev: page > 1
      }
    };
  }
}

export const productService = new ProductService();