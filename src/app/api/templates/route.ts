import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const defaultTemplates = [
  {
    templateName: 'E-commerce Store',
    templateCategory: 'ecommerce',
    layoutData: {
      components: [
        {
          id: 'nav-1',
          type: 'navigation',
          props: { heading: 'My Store', buttonText: 'Shop Now' },
          styles: { base: { backgroundColor: '#ffffff' } },
          children: []
        },
        {
          id: 'hero-1',
          type: 'hero',
          props: { 
            heading: 'Welcome to Our Store',
            subheading: 'Discover amazing products at great prices',
            buttonText: 'Shop Now'
          },
          styles: { base: { backgroundColor: '#3b82f6', color: '#ffffff' } },
          children: []
        },
        {
          id: 'products-1',
          type: 'products',
          props: { heading: 'Featured Products' },
          styles: { base: {} },
          children: []
        }
      ]
    },
    industryTags: ['retail', 'ecommerce', 'fashion'],
    isPublic: true
  },
  {
    templateName: 'Service Business',
    templateCategory: 'service',
    layoutData: {
      components: [
        {
          id: 'nav-2',
          type: 'navigation',
          props: { heading: 'Service Co', buttonText: 'Contact Us' },
          styles: { base: { backgroundColor: '#ffffff' } },
          children: []
        },
        {
          id: 'hero-2',
          type: 'hero',
          props: { 
            heading: 'Professional Services',
            subheading: 'Expert solutions for your business needs',
            buttonText: 'Get Started'
          },
          styles: { base: { backgroundColor: '#10b981', color: '#ffffff' } },
          children: []
        },
        {
          id: 'text-1',
          type: 'text',
          props: { 
            heading: 'About Our Services',
            text: 'We provide professional services to help your business grow and succeed.'
          },
          styles: { base: {} },
          children: []
        }
      ]
    },
    industryTags: ['service', 'consulting', 'professional'],
    isPublic: true
  }
];

export async function GET() {
  try {
    let templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' }
    });

    // Seed default templates if none exist
    if (templates.length === 0) {
      const createdTemplates = await prisma.template.createMany({
        data: defaultTemplates,
        skipDuplicates: true
      });
      if (createdTemplates.count > 0) {
        templates = defaultTemplates.map((template, index) => ({
          id: `template-${index}`,
          createdAt: new Date(),
          ...template
        })) as any;
      }
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('[TEMPLATES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}