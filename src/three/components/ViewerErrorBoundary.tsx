import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../../types/product';

interface Props {
  children: ReactNode;
  fallbackPhoto?: Product['photo'];
  productName?: string;
  language?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export class ViewerErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: !isWebGLAvailable(),
    errorMessage: !isWebGLAvailable() ? 'WebGL is not supported on this browser/device.' : '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Viewer WebGL Error:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      const { fallbackPhoto, productName, language = 'ar' } = this.props;
      const isAr = language === 'ar';

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-marble-100 rounded-2xl border border-gold/30 text-center shadow-inner">
          {fallbackPhoto ? (
            <div className="relative w-full max-w-md h-64 mb-4 rounded-xl overflow-hidden shadow-lg border border-gold/40">
              <img
                src={fallbackPhoto.src}
                alt={productName || 'Turquoise Furniture'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 end-2 px-2.5 py-1 rounded-full bg-charcoal-dark/80 text-gold text-xs font-semibold backdrop-blur-sm">
                {isAr ? 'عرض الصورة الفوتوغرافية' : 'Photo Preview Mode'}
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}

          <div className="inline-flex items-center gap-2 text-gold-dark font-heading font-bold text-lg mb-1">
            <AlertCircle className="w-5 h-5 text-gold" />
            <span>
              {isAr ? 'عرض ثلاثي الأبعاد غير متوفر' : '3D WebGL Acceleration Unavailable'}
            </span>
          </div>

          <p className="text-xs text-charcoal/70 max-w-sm mb-4">
            {isAr
              ? 'يتطلب العرض التفاعلي دعم WebGL. يمكنك مواصلة استعراض صور المعرض عالية الدقة وطلب المواصفات عبر واتساب.'
              : 'Interactive 3D rendering requires WebGL support. You can browse high-definition gallery photographs and request bespoke specifications directly on WhatsApp.'}
          </p>

          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg bg-gold-gradient text-charcoal-dark font-bold text-xs shadow hover:brightness-105 transition-all"
          >
            {isAr ? 'إعادة محاولة التحميل' : 'Retry 3D Loading'}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
