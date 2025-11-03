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
        for (const opt of options) {
          const productOption = await tx.productOption.create({
            data: {
              productId: product.id,
              name: opt.name,
              values: {
                create: opt.values.map(val => ({ value: val })),
              },
            },
          });
        }
      }

      if (variants && variants.length > 0) {
        for (const variantData of variants) {
          const productVariant = await tx.productVariant.create({
            data: {
              productId: product.id,
              name: variantData.optionValues.map(ov => ov.value).join(' / '), // Generate variant name
              sku: variantData.sku,
              price: variantData.price,
              quantity: variantData.stock,
            },
          });

          // Connect variant to option values
          for (const ov of variantData.optionValues) {
            const optionValue = await tx.productOptionValue.findFirst({
              where: {
                option: { productId: product.id, name: ov.optionName },
                value: ov.value,
              },
            });
            if (optionValue) {
              await tx.productVariantOptionValue.create({
                data: {
                  variantId: productVariant.id,
                  optionValueId: optionValue.id,
                },
              });
            }
          }
        }
      }

      // TODO: Trigger asynchronous post-processing (Image Optimization, Search Indexing, Notifications)

      return product;
    });
  }

  async updateProduct(productId: string, data: Partial<CreateProductData>) {
    const { tenantId, userId, name, description, status, categoryIds, mediaUrls, options, variants } = data;

    // TODO: Implement RBAC check here for update permissions

    return prisma.$transaction(async (tx) => {
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

        for (const opt of options) {
          const productOption = await tx.productOption.create({
            data: {
              productId: productId,
              name: opt.name,
              values: {
                create: opt.values.map(val => ({ value: val })),
              },
            },
          });
        }
      }

      if (variants) {
        // If options were provided, variants should be recreated based on new options
        if (!options) { // Only delete if options were not provided (to avoid double deletion)
          await tx.productVariant.deleteMany({ where: { productId } });
        }

        for (const variantData of variants) {
          const productVariant = await tx.productVariant.create({
            data: {
              productId: productId,
              name: variantData.optionValues.map(ov => ov.value).join(' / '),
              sku: variantData.sku,
              price: variantData.price,
              quantity: variantData.stock,
            },
          });

          for (const ov of variantData.optionValues) {
            const optionValue = await tx.productOptionValue.findFirst({
              where: {
                option: { productId: productId, name: ov.optionName },
                value: ov.value,
              },
            });
            if (optionValue) {
              await tx.productVariantOptionValue.create({
                data: {
                  variantId: productVariant.id,
                  optionValueId: optionValue.id,
                },
              });
            }
          }
        }
      }

      // TODO: Trigger asynchronous post-processing for updates

      return updatedProduct;
    });
  }

  async deleteProduct(productId: string, tenantId: string, userId: string) {
    // TODO: Implement RBAC check here for delete permissions

    return prisma.$transaction(async (tx) => {
      // Delete ProductVariantOptionValue records first
      await tx.productVariantOptionValue.deleteMany({
        where: { variant: { productId: productId } },
      });
      // Delete ProductOptionValue records
      await tx.productOptionValue.deleteMany({
        where: { option: { productId: productId } },
      });
      // Delete ProductVariant records
      await tx.productVariant.deleteMany({
        where: { productId: productId },
      });
      // Delete ProductOption records
      await tx.productOption.deleteMany({
        where: { productId: productId },
      });
      // Delete Media records
      await tx.media.deleteMany({
        where: { productId: productId },
      });
      // Finally, delete the Product
      await tx.product.delete({
        where: { id: productId, tenantId },
      });
    });
  }

  async getProduct(productId: string, tenantId: string) {
    // TODO: Implement RBAC check here for read permissions
    return prisma.product.findUnique({
      where: { id: productId, tenantId },
      include: {
        media: true,
        categories: true,
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: true,
              },
            },
          },
        },
        options: {
          include: {
            values: true,
          },
        },
      },
    });
  }

  async listProducts(tenantId: string, searchTerm?: string, categoryId?: string) {
    // TODO: Implement RBAC check here for read permissions
    return prisma.product.findMany({
      where: {
        tenantId,
        name: searchTerm ? { contains: searchTerm, mode: 'insensitive' } : undefined,
        categories: categoryId ? { some: { id: categoryId } } : undefined,
      },
      include: {
        media: true,
        categories: true,
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: true,
              },
            },
          },
        },
        options: {
          include: {
            values: true,
          },
        },
      },
    });
  }
}

export const productService = new ProductService();
