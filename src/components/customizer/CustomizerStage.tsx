import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  Sun,
  Moon,
  RotateCw,
  Play,
  Pause,
  Box,
  User,
  Camera,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { spring } from '@animate-ui/react/utils/motion';
import { useCustomizerStore } from '../../store/customizerStore';
import { StudioEnvironment, type LightingPreset } from '../../three/components/StudioEnvironment';
import { StudioFloor } from '../../three/components/StudioFloor';
import { ModelViewerCore } from '../../three/components/ModelViewerCore';
import { DimensionOverlay } from './DimensionOverlay';
import { RoomScaleReference } from './RoomScaleReference';
import { ViewerErrorBoundary } from '../../three/components/ViewerErrorBoundary';
import { useTranslation } from '../../i18n';

interface CustomizerStageProps {
  onCaptureCanvas?: (canvas: HTMLCanvasElement) => void;
  className?: string;
}

export const CustomizerStage: React.FC<CustomizerStageProps> = ({
  onCaptureCanvas,
  className = 'w-full h-[520px] lg:h-[680px]',
}) => {
  const { language } = useTranslation();
  const [lighting, setLighting] = useState<LightingPreset>('day');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showPhotoBackdrop, setShowPhotoBackdrop] = useState(false);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    currentProduct,
    selectedColorHex,
    selectedWoodHex,
    selectedMetalHex,
    dimensionsCm,
    showRoomScale,
    toggleRoomScale,
    roomDimensionsCm,
    roomPhoto,
    setRoomPhoto,
  } = useCustomizerStore();

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(2.8, 1.9, 3.4);
      controlsRef.current.target.set(0, 0.45, 0);
      controlsRef.current.update();
    }
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const ctrl = controlsRef.current;
      if (!ctrl) return;

      if (e.key === 'ArrowLeft') {
        ctrl.setAzimuthalAngle(ctrl.getAzimuthalAngle() - 0.1);
        ctrl.update();
      } else if (e.key === 'ArrowRight') {
        ctrl.setAzimuthalAngle(ctrl.getAzimuthalAngle() + 0.1);
        ctrl.update();
      } else if (e.key.toLowerCase() === 'r') {
        handleResetCamera();
      } else if (e.key.toLowerCase() === 'd') {
        setLighting((l) => (l === 'day' ? 'evening' : 'day'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResetCamera]);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-gold/40 shadow-2xl bg-marble-100 select-none ${className}`}
    >
      {/* Optional Client-Side Room Photo Backdrop */}
      {showPhotoBackdrop && roomPhoto && (
        <div className="absolute inset-0 z-0">
          <img
            src={roomPhoto.dataUrl}
            alt="Client room backdrop"
            className="w-full h-full object-cover opacity-25 filter blur-sm"
          />
        </div>
      )}

      {/* Floating Top Controls Toolbar */}
      <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between pointer-events-none">
        
        {/* Left: Active Piece & Lighting Indicator */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/40 shadow-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="font-heading font-bold text-xs text-charcoal">
              {currentProduct.name[language] || currentProduct.name.ar}
            </span>
          </div>

          {/* Toggle Room Scale Reference Button */}
          <motion.button
            data-action="room-scale"
            onClick={toggleRoomScale}
            whileTap={{ scale: 0.92 }}
            transition={spring.press}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm transition-all ${
              showRoomScale
                ? 'bg-gold-gradient text-charcoal-dark border-gold'
                : 'bg-marble-50/90 text-charcoal border-gold/30 hover:border-gold'
            }`}
            title={language === 'ar' ? 'عرض مجسم القياس البشري والغرفة' : 'Toggle Human & Room Scale Reference'}
          >
            <User className="w-3.5 h-3.5 text-gold-dark" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'مقياس الغرفة والإنسان' : 'Room Scale'}
            </span>
          </motion.button>
        </div>

        {/* Right: Controls & Presets */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Warm Evening Toggle */}
          <motion.button
            onClick={() => setLighting((l) => (l === 'day' ? 'evening' : 'day'))}
            whileTap={{ scale: 0.92 }}
            transition={spring.press}
            className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark shadow-sm transition-all"
            title={lighting === 'day' ? 'Switch to Warm Evening Lighting' : 'Switch to Day Studio Lighting'}
          >
            {lighting === 'day' ? (
              <Sun className="w-4 h-4 text-gold-dark" />
            ) : (
              <Moon className="w-4 h-4 text-amber-500" />
            )}
          </motion.button>

          {/* Auto Rotate Play / Pause */}
          <motion.button
            onClick={() => setIsAutoRotating((r) => !r)}
            whileTap={{ scale: 0.92 }}
            transition={spring.press}
            className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark shadow-sm transition-all"
            title={isAutoRotating ? 'Pause rotation' : 'Auto-rotate'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>

          {/* Reset Camera View */}
          <motion.button
            onClick={handleResetCamera}
            whileTap={{ scale: 0.92 }}
            transition={spring.press}
            className="p-2 rounded-full bg-marble-50/90 backdrop-blur-md border border-gold/30 text-charcoal hover:text-gold-dark shadow-sm transition-all"
            title="Reset 3D Perspective (R)"
          >
            <RotateCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <ViewerErrorBoundary
        fallbackPhoto={currentProduct.photo}
        productName={currentProduct.name[language]}
        language={language}
      >
        <Canvas
          shadows
          camera={{ position: [2.8, 1.9, 3.4], fov: 42 }}
          gl={{
            preserveDrawingBuffer: true, // Needed for PNG canvas snapshot export!
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: lighting === 'day' ? 1.05 : 1.18,
          }}
          dpr={[1, 1.75]}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
            if (onCaptureCanvas) onCaptureCanvas(gl.domElement);
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Lightformers Studio Lighting */}
          <StudioEnvironment preset={lighting} />

          {/* Soft Carrara Marble Ground Plinth */}
          <StudioFloor radius={4.2} />

          {/* Active 3D Model with Real-Time Custom Material Swatches & Dimensions */}
          <ModelViewerCore
            product={currentProduct}
            colorHex={selectedColorHex}
            woodHex={selectedWoodHex}
            metalHex={selectedMetalHex}
            dimensionsCm={dimensionsCm}
          />

          {/* Live Dimension Overlay Bounding Lines */}
          <DimensionOverlay dimensionsCm={dimensionsCm} />

          {/* 3D Human Silhouette & Room Box (when toggled) */}
          {showRoomScale && (
            <RoomScaleReference roomDimensionsCm={roomDimensionsCm} />
          )}

          {/* Showroom Camera OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={1.4}
            maxDistance={7.0}
            maxPolarAngle={Math.PI / 2.05} // Never dip beneath marble plinth
            minPolarAngle={0.12}
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.8}
            enablePan={false}
            target={[0, 0.45, 0]}
            onStart={() => setIsAutoRotating(false)}
          />
        </Canvas>
      </ViewerErrorBoundary>

      {/* Floating Bottom Bar: Active Room Photo & Controls */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between pointer-events-none">
        {/* Interaction Hint */}
        <div className="px-3.5 py-1.5 rounded-full bg-charcoal-dark/80 backdrop-blur-md text-marble-100 text-xs font-sans shadow-md pointer-events-auto flex items-center gap-2">
          <Box className="w-3.5 h-3.5 text-gold" />
          <span>
            {dimensionsCm.w} × {dimensionsCm.d} × {dimensionsCm.h} cm
          </span>
        </div>

        {/* Room Photo Badge if uploaded */}
        {roomPhoto && (
          <div className="flex items-center gap-2 bg-marble-50/90 backdrop-blur-md border border-gold/40 px-3 py-1.5 rounded-full shadow-md pointer-events-auto">
            <Camera className="w-3.5 h-3.5 text-gold-dark" />
            <button
              onClick={() => setShowPhotoBackdrop((b) => !b)}
              className="text-xs font-bold text-charcoal hover:text-gold-dark"
            >
              {showPhotoBackdrop
                ? language === 'ar' ? 'إخفاء خلفية الغرفة' : 'Hide Backdrop'
                : language === 'ar' ? 'معاينة الغرفة في الخلفية' : 'Preview Room Backdrop'}
            </button>
            <button
              onClick={() => {
                setRoomPhoto(null);
                setShowPhotoBackdrop(false);
              }}
              className="p-1 hover:bg-marble-200 rounded-full text-charcoal/60 hover:text-red-500"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
