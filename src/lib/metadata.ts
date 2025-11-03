import { Metadata } from 'next';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}

export function generateMetadata({
  title,
  description,
  path = '',
  keywords = [],
  image,
}: GenerateMetadataProps): Metadata {
  const url = `https://pasaal.io${path}`;
  const ogImage = image || '/opengraph-image';

  return {
    title,
    description,
    keywords: ['PASAAL.IO', 'Nepal', 'SaaS', ...keywords],
    openGraph: {
      title,
      description,
      url,
      siteName: 'PASAAL.IO',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@pasaalio',
    },
    alternates: {
      canonical: url,
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://pasaal.io'),
  title: {
    default: 'PASAAL.IO - Multi-tenant SaaS Platform for Nepal',
    template: '%s | PASAAL.IO'
  },
  description: 'Automate your inventory, sales, and customer management with PASAAL.IO - the leading SaaS platform built for Nepali businesses.',
  keywords: ['SaaS', 'Nepal', 'inventory management', 'business automation', 'e-commerce', 'multi-tenant'],
  authors: [{ name: 'PASAAL.IO Team' }],
  creator: 'PASAAL.IO',
  publisher: 'PASAAL.IO',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};