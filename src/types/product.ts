import productsData from '@/data/products.json';
import assetsData from '@/data/assets.generated.json';

export type ProductCategory = 'all' | 'seating' | 'tables' | 'curtains';

export interface ProductDimensions {
  w: number;
  d: number;
  h: number;
}

export interface ProductColorOption {
  id: string;
  hex: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
}

export interface ProductAssetMeta {
  id: string;
  originalName: string;
  width: number;
  height: number;
  aspectRatio: number;
  focal: { x: number; y: number };
  lqip: string;
  palette: string[];
  defaultColor: string;
  accentColor: string;
  alt: {
    ar: string;
    fr: string;
    en: string;
  };
  src: string;
  srcJpg: string;
  srcset: {
    avif: string;
    webp: string;
    jpg: string;
  };
}

export interface ProductItem {
  id: string;
  category: 'seating' | 'tables' | 'curtains';
  proceduralKey: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  tagline: {
    ar: string;
    fr: string;
    en: string;
  };
  description: {
    ar: string;
    fr: string;
    en: string;
  };
  dimensionsCm: ProductDimensions;
  materials: {
    ar: string[];
    fr: string[];
    en: string[];
  };
  colorOptions: ProductColorOption[];
  photo: ProductAssetMeta | null;
  secondaryPhotos?: ProductAssetMeta[];
  glbUrl?: string;
}

export function getAllProducts(): ProductItem[] {
  const assetsMap = assetsData as Record<string, ProductAssetMeta>;

  return (productsData as unknown as Array<Omit<ProductItem, 'photo' | 'secondaryPhotos'>>).map((prod) => {
    const photo = assetsMap[prod.id] || null;
    const secondary: ProductAssetMeta[] = [];

    // Attach known secondary shots
    if (prod.id === 'oval-dining-set' && assetsMap['oval-dining-set-showroom']) {
      secondary.push(assetsMap['oval-dining-set-showroom']);
    }
    if (prod.id === 'side-table' && assetsMap['side-table-detail']) {
      secondary.push(assetsMap['side-table-detail']);
    }
    if (prod.id === 'velvet-accent-chair' && assetsMap['velvet-accent-chair-rear']) {
      secondary.push(assetsMap['velvet-accent-chair-rear']);
    }

    return {
      ...prod,
      photo,
      secondaryPhotos: secondary.length > 0 ? secondary : undefined,
    };
  });
}

export type Product = ProductItem;

export function getProductById(id: string): ProductItem | undefined {
  return getAllProducts().find((p) => p.id === id);
}

