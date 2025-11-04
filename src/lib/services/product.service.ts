import { PrismaClient } from '@prisma/client';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const prisma = new PrismaClient();

interface CreateProductData {
  tenantId: string;
  userId: string; // For RBAC and audit logging
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

    // TODO: Implement RBAC check here
    // Example: check if userId has 'product:create' permission for tenantId

    const slug = generateSlug(name);

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          tenantId,
          name,
          slug,
          description,
          status: status || 'DRAFT',
          categories: {
            connect: categoryIds?.map(id => ({ id })) || [],
          },
        },
      });

      if (mediaUrls && mediaUrls.length > 0) {
        await tx.media.createMany({
          data: mediaUrls.map((media, index) => ({
            productId: product.id,
            url: media.url,
            altText: media.altText,
            order: media.order !== undefined ? media.order : index,
          })),
        });
      }

      if (options && options.length > 0) {
        // Bulk create options in parallel for better performance
        const createdOptions = await Promise.all(
          options.map(opt => 
            tx.productOption.create({
              data: {
                productId: product.id,
                name: opt.name,
                values: {
                  create: opt.values.map(val => ({ value: val })),
                },
              },
            })
          )
        );
      }

      if (variants && variants.length > 0) {
        // Bulk fetch all option values for this product to avoid N+1 queries
        const allOptionValues = await tx.productOptionValue.findMany({
          where: {
            option: { productId: product.id }
          },
          include: {
            option: true
          }
        });
        
        // Create a lookup map for O(1) access
        const optionValueMap = new Map<string, string>();
        allOptionValues.forEach(ov => {
          const key = `${ov.option.name}:${ov.value}`;
          optionValueMap.set(key, ov.id);
        });
        
        // Prepare bulk variant data
        const variantCreateData = variants.map(variantData => ({
          productId: product.id,
          name: variantData.optionValues.map(ov => ov.value).join(' / '),
          sku: variantData.sku,
          price: variantData.price,
          quantity: variantData.stock,
        }));
        
        // Bulk create variants
        const createdVariants = await Promise.all(
          variantCreateData.map(data => tx.productVariant.create({ data }))
        );
        
        // Prepare bulk variant-option-value connections
        const variantOptionConnections: Array<{
          variantId: string;
          optionValueId: string;
        }> = [];
        
        variants.forEach((variantData, index) => {
          const variantId = createdVariants[index].id;
          
          variantData.optionValues.forEach(ov => {
            const key = `${ov.optionName}:${ov.value}`;
            const optionValueId = optionValueMap.get(key);
            
            if (optionValueId) {
              variantOptionConnections.push({
                variantId,
                optionValueId
              });
            }
          });
        });
        
        // Bulk create variant-option-value connections
        if (variantOptionConnections.length > 0) {
          await tx.productVariantOptionValue.createMany({
            data: variantOptionConnections,
            skipDuplicates: true
          });
        }
      }

      try {
        // TODO: Trigger asynchronous post-processing (Image Optimization, Search Indexing, Notifications)

        return product;
      } catch (createError) {
        console.error('[PRODUCT_CREATE_ERROR]', createError);
        throw new Error('Failed to create product');
      }
    });
  }

  async updateProduct(productId: string, data: Partial<CreateProductData>) {
    const { tenantId, userId, name, description, status, categoryIds, mediaUrls, options, variants } = data;

    // TODO: Implement RBAC check here for update permissions

    try {
      return await prisma.$transaction(async (tx) => {
        const currentProduct = await tx.product.findUnique({
          where: { id: productId, tenantId },
          include: { categories: true },
        });

        if (!currentProduct) {
          throw new Error('Product not found');
        }

        const slug = name ? generateSlug(name) : currentProduct.slug;

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name: name || currentProduct.name,
          slug,
          description: description || currentProduct.description,
          status: status || currentProduct.status,
          categories: categoryIds ? {
            set: categoryIds.map(id => ({ id })),
          } : undefined,
        },
      });

      // Update Media
      if (mediaUrls) {
        await tx.media.deleteMany({ where: { productId } }); // Clear existing media
        await tx.media.createMany({
          data: mediaUrls.map((media, index) => ({
            productId: productId,
            url: media.url,
            altText: media.altText,
            order: media.order !== undefined ? media.order : index,
          })),
        });
      }

      // Update Options and Variants (This is a simplified approach and might need more complex diffing logic for a real-world scenario)
      if (options) {
        // For simplicity, delete existing options/variants and recreate. 
        // In a real app, you'd want to diff and update.
        await tx.productOption.deleteMany({ where: { productId } });
        await tx.productVariant.deleteMany({ where: { productId } });

        // Bulk create options in parallel for better performance
        const createdOptions = await Promise.all(
          options.map(opt => 
            tx.productOption.create({
              data: {
                productId: productId,
                name: opt.name,
                values: {
                  create: opt.values.map(val => ({ value: val })),
                },
              },
            })
          )
        );
      }

      if (variants) {
        // If options were provided, variants should be recreated based on new options
        if (!options) { // Only delete if options were not provided (to avoid double deletion)
          await tx.productVariant.deleteMany({ where: { productId } });
        }

        // Bulk fetch all option values for this product to avoid N+1 queries
        const allOptionValues = await tx.productOptionValue.findMany({
          where: {
            option: { productId: productId }
          },
          include: {
            option: true
          }
        });
        
        // Create a lookup map for O(1) access
        const optionValueMap = new Map<string, string>();
        allOptionValues.forEach(ov => {
          const key = `${ov.option.name}:${ov.value}`;
          optionValueMap.set(key, ov.id);
        });
        
        // Prepare bulk variant data
        const variantCreateData = variants.map(variantData => ({
          productId: productId,
          name: variantData.optionValues.map(ov => ov.value).join(' / '),
          sku: variantData.sku,
          price: variantData.price,
          quantity: variantData.stock,
        }));
        
        // Bulk create variants
        const createdVariants = await Promise.all(
          variantCreateData.map(data => tx.productVariant.create({ data }))
        );
        
        // Prepare bulk variant-option-value connections
        const variantOptionConnections: Array<{
          variantId: string;
          optionValueId: string;
        }> = [];
        
        variants.forEach((variantData, index) => {
          const variantId = createdVariants[index].id;
          
          variantData.optionValues.forEach(ov => {
            const key = `${ov.optionName}:${ov.value}`;
            const optionValueId = optionValueMap.get(key);
            
            if (optionValueId) {
              variantOptionConnections.push({
                variantId,
                optionValueId
              });
            }
          });
        });
        
        // Bulk create variant-option-value connections
        if (variantOptionConnections.length > 0) {
          await tx.productVariantOptionValue.createMany({
            data: variantOptionConnections,
            skipDuplicates: true
          });
        }
      }

        // TODO: Trigger asynchronous post-processing for updates

        return updatedProduct;
      });
    } catch (error) {
      console.error('[PRODUCT_UPDATE_ERROR] Product update failed');
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new Error('Product not found or access denied');
        }
        if (error.message.includes('constraint')) {
          throw new Error('Product update failed due to data constraints');
        }
        throw error;
      }
      
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string, tenantId: string, userId: string) {
    // TODO: Implement RBAC check here for delete permissions

    try {
      return await prisma.$transaction(async (tx) => {
        // First, verify the product exists and belongs to the tenant
        const existingProduct = await tx.product.findUnique({
          where: { id: productId, tenantId },
          include: {
            variants: { select: { id: true } },
            options: { select: { id: true } },
            media: { select: { id: true } }
          }
        });

        if (!existingProduct) {
          throw new Error('Product not found or access denied');
        }

        // Check for active order references that would prevent deletion
        const activeOrderItems = await tx.orderItem.findFirst({
          where: {
            productId: productId,
            order: {
              status: { in: ['pending', 'confirmed', 'processing'] }
            }
          }
        });

        if (activeOrderItems) {
          throw new Error('Cannot delete product: referenced in active orders');
        }

        // Perform cascading deletes with error handling
        try {
          // Delete ProductVariantOptionValue records first
          const deletedVariantOptions = await tx.productVariantOptionValue.deleteMany({
            where: { variant: { productId: productId } },
          });
          
          // Delete ProductOptionValue records
          const deletedOptionValues = await tx.productOptionValue.deleteMany({
            where: { option: { productId: productId } },
          });
          
          // Delete ProductVariant records
          const deletedVariants = await tx.productVariant.deleteMany({
            where: { productId: productId },
          });
          
          // Delete ProductOption records
          const deletedOptions = await tx.productOption.deleteMany({
            where: { productId: productId },
          });
          
          // Delete Media records
          const deletedMedia = await tx.media.deleteMany({
            where: { productId: productId },
          });
          
          // Finally, delete the Product
          const deletedProduct = await tx.product.delete({
            where: { id: productId, tenantId },
          });

          // Log successful deletion for audit
          console.log('[PRODUCT_DELETE_SUCCESS] Product deleted successfully');
          
          return {
            success: true,
            deletedCounts: {
              variantOptions: deletedVariantOptions.count,
              optionValues: deletedOptionValues.count,
              variants: deletedVariants.count,
              options: deletedOptions.count,
              media: deletedMedia.count,
              product: 1
            }
          };
          
        } catch (cascadeError) {
          console.error('[PRODUCT_DELETE_CASCADE_ERROR] Cascade deletion failed');
          throw new Error('Failed to delete product dependencies');
        }
      });
    } catch (error) {
      console.error('[PRODUCT_DELETE_ERROR] Product deletion failed');
      
      if (error instanceof Error) {
        if (error.message.includes('Foreign key constraint')) {
          throw new Error('Cannot delete product: referenced by other records');
        }
        if (error.message.includes('not found')) {
          throw new Error('Product not found or access denied');
        }
        throw error;
      }
      
      throw new Error('Product deletion failed due to unexpected error');
    }
  }

  async getProduct(productId: string, tenantId: string) {
    // TODO: Implement RBAC check here for read permissions
    
    // Optimized single product query with selective includes
    return prisma.product.findUnique({
      where: { id: productId, tenantId },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            altText: true,
            order: true
          },
          orderBy: { order: 'asc' }
        },
        categories: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            quantity: true
          }
        },
        options: {
          select: {
            id: true,
            name: true,
            values: {
              select: {
                id: true,
                value: true
              }
            }
          }
        },
      },
    });
  }

  async listProducts(
    tenantId: string, 
    searchTerm?: string, 
    categoryId?: string,
    page: number = 1,
    limit: number = 20,
    includeDetails: boolean = false
  ) {
    // TODO: Implement RBAC check here for read permissions
    
    const skip = (page - 1) * limit;
    
    // Base query for product listing (optimized for performance)
    const baseInclude = {
      media: {
        select: {
          id: true,
          url: true,
          altText: true,
          order: true
        },
        take: 1, // Only get the first image for listing
        orderBy: { order: 'asc' as const }
      },
      categories: {
        select: {
          id: true,
          name: true
        }
      },
      variants: {
        select: {
          id: true,
          price: true,
          quantity: true
        },
        take: 1, // Only get first variant for listing
        orderBy: { price: 'asc' as const }
      }
    };
    
    // Detailed include for individual product views
    const detailedInclude = {
      media: {
        select: {
          id: true,
          url: true,
          altText: true,
          order: true
        },
        orderBy: { order: 'asc' as const }
      },
      categories: {
        select: {
          id: true,
          name: true
        }
      },
      variants: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          quantity: true
        }
      },
      options: {
        select: {
          id: true,
          name: true,
          values: {
            select: {
              id: true,
              value: true
            }
          }
        }
      }
    };
    
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          tenantId,
          name: searchTerm ? { contains: searchTerm, mode: 'insensitive' } : undefined,
          categories: categoryId ? { some: { id: categoryId } } : undefined,
        },
        include: includeDetails ? detailedInclude : baseInclude,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      // Get total count for pagination
      prisma.product.count({
        where: {
          tenantId,
          name: searchTerm ? { contains: searchTerm, mode: 'insensitive' } : undefined,
          categories: categoryId ? { some: { id: categoryId } } : undefined,
        }
      })
    ]);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    };
  }
}

export const productService = new ProductService();
