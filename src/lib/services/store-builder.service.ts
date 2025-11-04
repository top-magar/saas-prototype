import { prisma } from '@/lib/prisma';

export interface PageComponent {
  id: string;
  type: 'navigation' | 'hero' | 'products' | 'text' | 'image' | 'testimonials' | 'cta' | 'footer';
  props: Record<string, any>;
  styles: {
    base: Record<string, any>;
    responsive?: {
      mobile?: Record<string, any>;
      tablet?: Record<string, any>;
      desktop?: Record<string, any>;
    };
  };
  children: PageComponent[];
}

export interface StorePage {
  id: string;
  storeId: string;
  pageName: string;
  pageSlug: string;
  pageType: 'home' | 'product' | 'collection' | 'custom';
  components: PageComponent[];
  seoMetadata?: {
    title: string;
    description: string;
    keywords?: string[];
  };
}

export class StoreBuilderService {
  async createStore(tenantId: string, data: {
    storeName: string;
    domain?: string;
    vanitySubdomain?: string;
    brandingConfig?: any;
  }) {
    return await prisma.store.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async getStores(tenantId: string) {
    try {
      return await prisma.store.findMany({
        where: { tenantId },
        include: {
          pages: {
            select: { id: true, pageName: true, publishStatus: true, updatedAt: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('[GET_STORES_ERROR]', error);
      throw new Error('Failed to fetch stores');
    }
  }

  async createPage(data: {
    storeId: string;
    pageName: string;
    pageSlug: string;
    pageType?: string;
    layoutData: { components: PageComponent[] };
    createdByUserId: string;
    seoMetadata?: any;
  }) {
    return await prisma.page.create({
      data: {
        ...data,
        pageType: data.pageType || 'custom',
      },
    });
  }

  async updatePage(pageId: string, data: {
    layoutData?: { components: PageComponent[] };
    pageName?: string;
    pageSlug?: string;
    seoMetadata?: any;
    publishStatus?: string;
  }, userId: string) {
    try {
      // Create version before updating
      const currentPage = await prisma.page.findUnique({
        where: { id: pageId }
      });

      if (currentPage) {
        try {
          await prisma.pageVersion.create({
            data: {
              pageId,
              versionNumber: currentPage.versionNumber,
              layoutData: currentPage.layoutData,
              createdByUserId: userId,
            }
          });
        } catch (versionError) {
          console.error('[PAGE_VERSION_ERROR]', versionError);
          // Continue without versioning
        }
      }

      return await prisma.page.update({
        where: { id: pageId },
        data: {
          ...data,
          versionNumber: currentPage ? currentPage.versionNumber + 1 : 1,
        },
      });
    } catch (error) {
      console.error('[UPDATE_PAGE_ERROR]', error);
      throw new Error('Failed to update page');
    }
  }

  async getPages(storeId: string) {
    return await prisma.page.findMany({
      where: { storeId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getPage(pageId: string) {
    return await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        store: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  }

  async publishPage(pageId: string) {
    return await prisma.page.update({
      where: { id: pageId },
      data: {
        publishStatus: 'published',
        publishedAt: new Date(),
      },
    });
  }

  async getPageVersions(pageId: string) {
    return await prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async restorePageVersion(pageId: string, versionNumber: number, userId: string) {
    try {
      const version = await prisma.pageVersion.findFirst({
        where: { pageId, versionNumber }
      });

      if (!version) {
        throw new Error('Version not found');
      }

      return await this.updatePage(pageId, {
        layoutData: version.layoutData as { components: PageComponent[] }
      }, userId);
    } catch (error) {
      console.error('[RESTORE_VERSION_ERROR]', error);
      throw new Error('Failed to restore page version');
    }
  }
}

export const storeBuilderService = new StoreBuilderService();