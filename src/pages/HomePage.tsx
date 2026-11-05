import React, { useState, useMemo } from 'react';
import { GreekColumnFrame } from '@/components/layout/GreekColumnFrame';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { CollectionSection } from '@/components/catalog/CollectionSection';
import { CurtainsSection } from '@/components/catalog/CurtainsSection';
import { CustomizerSection } from '@/components/customizer/CustomizerSection';
import { PhotoLightbox } from '@/components/catalog/PhotoLightbox';
import { QuickViewerModal } from '@/components/viewer/QuickViewerModal';
import { CompareModal } from '@/components/viewer/CompareModal';
import { BrandCrestModal } from '@/components/brand/BrandCrestModal';
import { QuoteCartDrawer } from '@/components/cart/QuoteCartDrawer';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/common/FloatingWhatsApp';
import { ProductItem, getAllProducts } from '@/types/product';
import { useCustomizerStore } from '@/store/customizerStore';

export const HomePage: React.FC = () => {
  const [lightboxProduct, setLightboxProduct] = useState<ProductItem | null>(null);
  const [viewerProduct, setViewerProduct] = useState<ProductItem | null>(null);
  const [viewerColor, setViewerColor] = useState<string | undefined>(undefined);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareProduct1, setCompareProduct1] = useState<ProductItem | undefined>(undefined);
  const [compareProduct2, setCompareProduct2] = useState<ProductItem | undefined>(undefined);
  const [crestModalOpen, setCrestModalOpen] = useState(false);

  const allProducts = useMemo(() => getAllProducts(), []);

  const curtainProducts = useMemo(
    () => allProducts.filter((p) => p.category === 'curtains'),
    [allProducts]
  );

  const handleOpenLightbox = (product: ProductItem) => {
    setLightboxProduct(product);
  };

  const handleOpenViewer = (product: ProductItem, colorHex?: string) => {
    setViewerProduct(product);
    setViewerColor(colorHex);
  };

  const handleOpenCompare = (product1?: ProductItem, product2?: ProductItem) => {
    setCompareProduct1(product1 || allProducts[0]);
    if (product2) {
      setCompareProduct2(product2);
    } else if (product1 && allProducts.length > 1) {
      const other = allProducts.find((p) => p.id !== product1.id) || allProducts[1];
      setCompareProduct2(other);
    }
    setCompareOpen(true);
  };

  const handleCustomize = (product: ProductItem) => {
    useCustomizerStore.getState().selectProduct(product.id);
    const el = document.getElementById('customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = `customizer?piece=${product.id}`;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-marble-200 overflow-x-hidden">
      {/* Neoclassical Greek column framing on left & right */}
      <GreekColumnFrame />

      {/* Main sticky luxury header */}
      <Header
        onOpenCompare={() => handleOpenCompare()}
        onOpenCrestModal={() => setCrestModalOpen(true)}
      />

      {/* Main page content container */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onCustomizeClick={() => {
            const el = document.getElementById('customizer');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3D Product Catalog Collection (Filtered) */}
        <CollectionSection
          onOpenLightbox={handleOpenLightbox}
          onOpenViewer={handleOpenViewer}
          onCustomize={handleCustomize}
          onCompare={handleOpenCompare}
        />

        {/* Curtains & Luxury Textiles Dedicated Showcase */}
        <CurtainsSection
          curtainProducts={curtainProducts}
          onOpenLightbox={handleOpenLightbox}
          onOpenViewer={handleOpenViewer}
          onCustomize={handleCustomize}
        />

        {/* 3D Bespoke Customizer Section (M4) */}
        <CustomizerSection />

        {/* About / Craftsmanship Section */}
        <AboutSection onOpenCrestModal={() => setCrestModalOpen(true)} />

        {/* Contact & Visit Section */}
        <ContactSection />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsApp />

      {/* High-Resolution Pinch-Zoom Photo Lightbox Modal */}
      <PhotoLightbox
        product={lightboxProduct}
        onClose={() => setLightboxProduct(null)}
      />

      {/* Quick 3D Viewer Modal */}
      <QuickViewerModal
        product={viewerProduct}
        initialColorHex={viewerColor}
        onClose={() => {
          setViewerProduct(null);
          setViewerColor(undefined);
        }}
        onCustomize={handleCustomize}
      />

      {/* 3D Side-by-Side Synchronized Compare Modal (M5) */}
      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        products={allProducts}
        initialProduct1={compareProduct1}
        initialProduct2={compareProduct2}
        onSelectProductForCustomizer={handleCustomize}
      />

      {/* Official Brand Crest High-Res Modal */}
      <BrandCrestModal
        isOpen={crestModalOpen}
        onClose={() => setCrestModalOpen(false)}
      />

      {/* Multi-Product Quote Cart Drawer (M5) */}
      <QuoteCartDrawer />
    </div>
  );
};
