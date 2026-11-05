import type { CustomizerState } from '../store/customizerStore';
import { getProductById } from '../types/product';

export interface DesignQueryParams {
  piece?: string;
  color?: string;
  wood?: string;
  metal?: string;
  w?: number;
  d?: number;
  h?: number;
}

/**
 * Encode current customizer configuration into URL query string
 */
export function encodeDesignParams(state: Pick<CustomizerState, 'selectedProductId' | 'selectedColorHex' | 'selectedWoodHex' | 'selectedMetalHex' | 'dimensionsCm'>): string {
  const params = new URLSearchParams();

  params.set('piece', state.selectedProductId);
  params.set('color', state.selectedColorHex.replace('#', ''));
  params.set('wood', state.selectedWoodHex.replace('#', ''));
  params.set('metal', state.selectedMetalHex.replace('#', ''));
  params.set('w', state.dimensionsCm.w.toString());
  params.set('d', state.dimensionsCm.d.toString());
  params.set('h', state.dimensionsCm.h.toString());

  return params.toString();
}

/**
 * Build absolute shareable URL for current design
 */
export function buildShareableDesignUrl(
  lang: string,
  state: Pick<CustomizerState, 'selectedProductId' | 'selectedColorHex' | 'selectedWoodHex' | 'selectedMetalHex' | 'dimensionsCm'>,
  origin: string = typeof window !== 'undefined' ? window.location.origin : 'https://turquoise-textile.dz'
): string {
  const query = encodeDesignParams(state);
  return `${origin}/${lang}/design?${query}`;
}

/**
 * Parse URL search query string back into design configuration
 */
export function decodeDesignParams(search: string): DesignQueryParams | null {
  const params = new URLSearchParams(search);
  const piece = params.get('piece');

  if (!piece) return null;

  const result: DesignQueryParams = {
    piece,
  };

  const color = params.get('color');
  if (color) result.color = `#${color}`;

  const wood = params.get('wood');
  if (wood) result.wood = `#${wood}`;

  const metal = params.get('metal');
  if (metal) result.metal = `#${metal}`;

  const w = params.get('w');
  if (w && !isNaN(Number(w))) result.w = Number(w);

  const d = params.get('d');
  if (d && !isNaN(Number(d))) result.d = Number(d);

  const h = params.get('h');
  if (h && !isNaN(Number(h))) result.h = Number(h);

  return result;
}

/**
 * Apply decoded parameters to store safely with validation
 */
export function applyDecodedParamsToStore(
  decoded: DesignQueryParams,
  actions: {
    selectProduct: (id: string) => void;
    setColorHex: (hex: string) => void;
    setWoodHex: (hex: string) => void;
    setMetalHex: (hex: string) => void;
    setDimensions: (dims: { w: number; d: number; h: number }) => void;
  }
): boolean {
  if (!decoded.piece) return false;

  const product = getProductById(decoded.piece);
  if (!product) return false;

  actions.selectProduct(product.id);

  if (decoded.color) actions.setColorHex(decoded.color);
  if (decoded.wood) actions.setWoodHex(decoded.wood);
  if (decoded.metal) actions.setMetalHex(decoded.metal);

  const defaultDims = product.dimensionsCm;
  actions.setDimensions({
    w: decoded.w && decoded.w > 0 ? decoded.w : defaultDims.w,
    d: decoded.d && decoded.d > 0 ? decoded.d : defaultDims.d,
    h: decoded.h && decoded.h > 0 ? decoded.h : defaultDims.h,
  });

  return true;
}
