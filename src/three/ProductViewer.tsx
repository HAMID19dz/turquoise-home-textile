import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  Sun,
  Moon,
  RotateCw,
  Maximize2,
  Upload,
  Play,
  Pause,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import type { Product } from '../types/product';
import { StudioEnvironment, type LightingPreset } from './components/StudioEnvironment';
import { StudioFloor } from './components/StudioFloor';
import { ModelViewerCore } from './components/ModelViewerCore';
import { ViewerErrorBoundary } from './components/ViewerErrorBoundary';
import { useTranslation } from '../i18n';
import { trackEvent } from '../utils/analytics';

interface ProductViewerProps {
  product: Product;
  activeColorHex?: string;
  activeMetalHex?: string;
  activeWoodHex?: string;
  customDimensions?: { w: number; d: number; h: number };
  className?: string;
  initialMode?: '3d' | 'photo';
  onOpenLightbox?: (product: Product) => void;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  activeColorHex,
  activeMetalHex,
  activeWoodHex,
  customDimensions,
  className = 'h-[500px]',
  initialMode = '3d',
  onOpenLightbox,
}) => {
  const { t, language } = useTranslation();
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>(initialMode);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('day');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [customGlbUrl, setCustomGlbUrl] = useState<string | null>(null);
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);

  // Active color swatch state with dynamic updates
  const [currentColorHex, setCurrentColorHex] = useState<string>(
    activeColorHex || product.colorOptions?.[0]?.hex || '#807060'
  );

  useEffect(() => {
    if (activeColorHex) {
      setCurrentColorHex(activeColorHex);
    } else if (product.colorOptions?.[0]?.hex) {
      setCurrentColorHex(product.colorOptions[0].hex);
    }
  }, [activeColorHex, product]);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(2.6, 1.8, 3.2);
      controlsRef.current.target.set(0, 0.45, 0);
      controlsRef.current.update();
    }
  }, []);

  // Handle local GLB File Selection or Drag & Drop
  const handleGlbFile = (file: File) => {
    if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
      const url = URL.createObjectURL(file);
      setCustomGlbUrl(url);
      setDroppedFileName(file.name);
      setViewMode('3d');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleGlbFile(e.dataTransfer.files[0]);
    }
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const ctrl = controlsRef.current;
      if (!ctrl) return;

      if (e.key === 'ArrowLeft') {
        ctrl.setAzimuthalAngle(ctrl.getAzimuthalAngle() - 0.1);
        ctrl.update();
      } else if (e.key === 'ArrowRight') {
        ctrl.setAzimuthalAngle(ctrl.getAzimuthalAngle() + 0.1);
        ctrl.update();
      } else if (e.key === 'ArrowUp') {
        ctrl.setPolarAngle(Math.max(0.2, ctrl.getPolarAngle() - 0.1));
        ctrl.update();
      } else if (e.key === 'ArrowDown') {
        ctrl.setPolarAngle(Math.min(Math.PI / 2.05, ctrl.getPolarAngle() + 0.1));
        ctrl.update();
      } else if (e.key === '+' || e.key === '=') {
        ctrl.dollyIn(1.1);
        ctrl.update();
      } else if (e.key === '-' || e.key === '_') {
        ctrl.dollyOut(1.1);
        ctrl.update();
      } else if (e.key.toLowerCase() === 'r') {
        handleResetCamera();
      } else if (e.key.toLowerCase() === 'd') {
        setLightingPreset((prev) => (prev === 'day' ? 'evening' : 'day'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResetCamera]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-marble-100 via-marble-50 to-marble-200 border border-gold/40 shadow-xl select-none ${className}`}
      tabIndex={0}
      role="region"
      aria-label={`3D Viewer: ${product.name[language] || product.id}`}
    >
      {/* ================= TOP CONTROLS BAR ================= */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Left: Mode Toggle (3D vs Real Photo) */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 shadow-md pointer-events-auto">
          <button
            onClick={() => setViewMode('3d')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-gold-gradient text-charcoal-dark shadow-sm'
                : 'text-charcoal/70 hover:text-charcoal hover:bg-marble-200'
            }`}
            aria-label="3D Interactive View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>

          {product.photo && (
            <button
              onClick={() => setViewMode('photo')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'photo'
                  ? 'bg-gold-gradient text-charcoal-dark shadow-sm'
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-marble-200'
              }`}
              aria-label="Real Photo View"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'صورة المعرض' : 'Photo'}</span>
            </button>
          )}
        </div>

        {/* Right: Lighting & Utilities */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Warm-Evening Lighting Toggle */}
          {viewMode === '3d' && (
            <button
              onClick={() => {
                const nextPreset = lightingPreset === 'day' ? 'evening' : 'day';
                setLightingPreset(nextPreset);
                trackEvent('lighting_toggle', {
                  preset: nextPreset,
                  productId: product.id,
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-xs font-semibold text-charcoal hover:text-gold-dark hover:border-gold shadow-sm transition-all"
              title={
                lightingPreset === 'day'
                  ? language === 'ar'
                    ? 'التبديل إلى إضاءة المساء الدافئة (D)'
                    : 'Switch to Warm Evening Lighting (D)'
                  : language === 'ar'
                  ? 'التبديل إلى إضاءة النهار الاستوديو (D)'
                  : 'Switch to Day Studio Lighting (D)'
              }
              aria-label="Toggle Lighting"
            >
              {lightingPreset === 'day' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'نهاري' : 'Day'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'مسائي' : 'Evening'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Reset Camera Button */}
          {viewMode === '3d' && (
            <button
              onClick={handleResetCamera}
              className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark hover:border-gold shadow-sm transition-all"
              title={language === 'ar' ? 'إعادة ضبط المنظور (R)' : 'Reset Camera View (R)'}
              aria-label="Reset Camera"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Auto Rotate Play / Pause */}
          {viewMode === '3d' && (
            <button
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark hover:border-gold shadow-sm transition-all"
              title={
                isAutoRotating
                  ? language === 'ar'
                    ? 'إيقاف الدوران التلقائي'
                    : 'Pause Auto-Rotation'
                  : language === 'ar'
                  ? 'تشغيل الدوران التلقائي'
                  : 'Start Auto-Rotation'
              }
              aria-label="Toggle Auto Rotation"
            >
              {isAutoRotating ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Hidden File Input for GLB Drag & Drop Demo */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleGlbFile(e.target.files[0]);
              }
            }}
          />

          {/* Upload / Test GLB Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-[11px] font-semibold text-charcoal/80 hover:text-gold-dark hover:border-gold shadow-sm transition-all"
            title="Preview local .glb file"
            aria-label="Upload custom GLB model"
          >
            <Upload className="w-3.5 h-3.5 text-gold-dark" />
            <span>GLB</span>
          </button>

          {/* Zoom Lightbox Trigger for Photos */}
          {product.photo && onOpenLightbox && (
            <button
              onClick={() => onOpenLightbox(product)}
              className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark hover:border-gold shadow-sm transition-all"
              title={language === 'ar' ? 'تكبير صورة المعرض' : 'Open Full Lightbox'}
              aria-label="Open Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Interactive Color Swatches Selector */}
      {viewMode === '3d' && product.colorOptions && product.colorOptions.length > 0 && (
        <div className="absolute top-16 start-3 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-marble-50/95 backdrop-blur-md border border-gold/40 shadow-luxury">
            <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider">
              {language === 'ar' ? 'الألوان:' : 'Colors:'}
            </span>
            <div className="flex items-center gap-1.5">
              {product.colorOptions.map((c) => {
                const isSelected = currentColorHex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCurrentColorHex(c.hex);
                      trackEvent('color_change', {
                        source: 'viewer_dock',
                        productId: product.id,
                        color: c.hex,
                      });
                    }}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-gold ring-2 ring-gold/60 scale-110 shadow-sm'
                        : 'border-marble-300 opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name[language] || c.name.ar}
                    aria-label={c.name[language] || c.name.ar}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN DISPLAY AREA ================= */}
      {viewMode === '3d' ? (
        <ViewerErrorBoundary
          fallbackPhoto={product.photo}
          productName={product.name[language]}
          language={language}
        >
          <Canvas
            shadows
            camera={{ position: [2.6, 1.8, 3.2], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: lightingPreset === 'day' ? 1.05 : 1.15,
            }}
            dpr={[1, 1.75]}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Realistic Lightformers Studio Environment */}
            <StudioEnvironment preset={lightingPreset} />

            {/* Soft Carrara Marble Plinth Floor + Contact Shadows */}
            <StudioFloor />

            {/* Core Model (GLB or Procedural) */}
            <ModelViewerCore
              product={product}
              colorHex={currentColorHex}
              metalHex={activeMetalHex}
              woodHex={activeWoodHex}
              dimensionsCm={customDimensions}
              glbUrl={customGlbUrl}
            />

            {/* OrbitControls Clamped for Showroom Presentation */}
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.06}
              minDistance={1.4}
              maxDistance={5.8}
              maxPolarAngle={Math.PI / 2.05} // Never dip beneath marble floor
              minPolarAngle={0.15}
              autoRotate={isAutoRotating}
              autoRotateSpeed={0.9}
              enablePan={false}
              target={[0, 0.45, 0]}
              onStart={() => setIsAutoRotating(false)}
            />
          </Canvas>
        </ViewerErrorBoundary>
      ) : (
        /* Real Showroom Photo Mode */
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {product.photo && (
            <img
              src={product.photo.src}
              srcSet={product.photo.srcset.webp}
              sizes="(max-width: 768px) 100vw, 800px"
              alt={product.name[language] || product.id}
              className="max-h-full max-w-full object-contain rounded-xl shadow-lg border border-gold/30"
              style={{
                objectPosition: `${product.photo.focal.x * 100}% ${product.photo.focal.y * 100}%`,
              }}
            />
          )}
        </div>
      )}

      {/* ================= BOTTOM METADATA & HINT BAR ================= */}
      <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Interaction Hint */}
        <div className="px-3 py-1.5 rounded-full bg-charcoal-dark/75 backdrop-blur-md text-marble-100 text-[11px] font-sans shadow-md pointer-events-auto">
          {droppedFileName ? (
            <span className="text-gold font-medium">Model: {droppedFileName}</span>
          ) : viewMode === '3d' ? (
            <span>{t('viewer.dragRotate')}</span>
          ) : (
            <span>{language === 'ar' ? 'صورة فوتوغرافية حقيقية' : 'Authentic Showroom Photograph'}</span>
          )}
        </div>

        {/* Keyboard Access Hint */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-[10px] text-charcoal/70 font-mono shadow-sm pointer-events-auto">
          <span>[Arrows]: Rotate</span>
          <span>•</span>
          <span>[+/-]: Zoom</span>
          <span>•</span>
          <span>[R]: Reset</span>
        </div>
      </div>
    </div>
  );
};
