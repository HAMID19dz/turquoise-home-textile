import type { CustomizerState } from '../store/customizerStore';
import { buildShareableDesignUrl } from './designUrl';

/**
 * Renders an editorial luxury PNG summary card and triggers download
 */
export async function downloadDesignSummaryCard(
  state: CustomizerState,
  language: 'ar' | 'fr' | 'en' = 'ar',
  canvas3dElement?: HTMLCanvasElement | null
): Promise<void> {
  const width = 1200;
  const height = 900;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Luxury White Carrara Marble Background
  ctx.fillStyle = '#FCFBF9';
  ctx.fillRect(0, 0, width, height);

  // Soft marble vein accents
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.bezierCurveTo(400, 180, 800, 120, 1200, 200);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 750);
  ctx.bezierCurveTo(350, 700, 850, 780, 1200, 720);
  ctx.stroke();

  // 2. 24k Gold Beveled Borders & Greek Key Corners
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // 3. Header: Brand Logo & Title
  const isAr = language === 'ar';
  ctx.fillStyle = '#C5A059';
  ctx.font = 'bold 20px "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.fillText('TURQUOISE HOME TEXTILE', width / 2, 75);

  ctx.fillStyle = '#2B2B2B';
  ctx.font = 'bold 32px "Amiri", "Cormorant Garamond", serif';
  ctx.fillText(
    isAr ? 'وثيقة مواصفات التصميم المخصص ثلاثي الأبعاد' : 'Bespoke 3D Haute Design Specification',
    width / 2,
    115
  );

  // Divider Line with Diamond
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 135);
  ctx.lineTo(width / 2 + 200, 135);
  ctx.stroke();

  // Diamond in center
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.moveTo(width / 2, 130);
  ctx.lineTo(width / 2 + 6, 135);
  ctx.lineTo(width / 2, 140);
  ctx.lineTo(width / 2 - 6, 135);
  ctx.closePath();
  ctx.fill();

  // 4. Center 3D Preview Image
  const previewW = 540;
  const previewH = 400;
  const previewX = 60;
  const previewY = 170;

  // Background box for 3D snapshot
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(previewX, previewY, previewW, previewH);
  ctx.strokeStyle = '#E0D4BA';
  ctx.lineWidth = 2;
  ctx.strokeRect(previewX, previewY, previewW, previewH);

  if (canvas3dElement) {
    try {
      ctx.drawImage(canvas3dElement, previewX, previewY, previewW, previewH);
    } catch {
      // Fallback text if tainted canvas
      ctx.fillStyle = '#C5A059';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Turquoise 3D Render Snapshot', previewX + previewW / 2, previewY + previewH / 2);
    }
  } else if (state.currentProduct.photo) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = state.currentProduct.photo.src;
    await new Promise((res) => {
      img.onload = () => {
        ctx.drawImage(img, previewX, previewY, previewW, previewH);
        res(null);
      };
      img.onerror = () => res(null);
    });
  }

  // 5. Right Column: Detailed Custom Specs
  const specX = 640;
  let specY = 190;
  const lineHeight = 38;

  ctx.textAlign = isAr ? 'right' : 'left';
  const textAnchorX = isAr ? width - 80 : specX;

  // Product Name
  ctx.fillStyle = '#2B2B2B';
  ctx.font = 'bold 28px "Amiri", "Cormorant Garamond", serif';
  ctx.fillText(
    `${isAr ? 'القطعة: ' : 'Piece: '} ${state.currentProduct.name[language] || state.currentProduct.name.ar}`,
    textAnchorX,
    specY
  );
  specY += lineHeight + 8;

  // Category
  ctx.fillStyle = '#C5A059';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(
    `${isAr ? 'التصنيف: ' : 'Category: '} ${state.currentProduct.category.toUpperCase()}`,
    textAnchorX,
    specY
  );
  specY += lineHeight;

  // Custom Dimensions
  ctx.fillStyle = '#2B2B2B';
  ctx.font = '16px monospace';
  ctx.fillText(
    `${isAr ? 'المقاسات: ' : 'Dimensions: '} ${state.dimensionsCm.w} × ${state.dimensionsCm.d} × ${state.dimensionsCm.h} cm`,
    textAnchorX,
    specY
  );
  specY += lineHeight;

  // Color Swatch
  ctx.fillStyle = '#2B2B2B';
  ctx.font = '16px sans-serif';
  ctx.fillText(
    `${isAr ? 'لون الخامة المختار: ' : 'Selected Finish: '} ${state.selectedColorHex}`,
    textAnchorX,
    specY
  );

  // Swatch color square
  const squareX = isAr ? textAnchorX - 250 : textAnchorX + 220;
  ctx.fillStyle = state.selectedColorHex;
  ctx.fillRect(squareX, specY - 14, 22, 22);
  ctx.strokeStyle = '#C5A059';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(squareX, specY - 14, 22, 22);
  specY += lineHeight;

  // Wood & Metal
  ctx.fillStyle = '#2B2B2B';
  ctx.fillText(
    `${isAr ? 'تشطيب الخشب والمعدن: ' : 'Wood & Metal Accents: '} ${state.selectedWoodHex} / ${state.selectedMetalHex}`,
    textAnchorX,
    specY
  );
  specY += lineHeight;

  // Curtains Details if applicable
  if (state.currentProduct.category === 'curtains') {
    ctx.fillText(
      `${isAr ? 'معامل التموج: ' : 'Fullness: '} ×${state.curtainOptions.fullness} | ${state.curtainOptions.embroidery} | ${state.curtainOptions.tieback}`,
      textAnchorX,
      specY
    );
    specY += lineHeight;
  }

  // Client Details
  if (state.clientName) {
    ctx.fillText(`${isAr ? 'العميل: ' : 'Client: '} ${state.clientName}`, textAnchorX, specY);
    specY += lineHeight;
  }
  if (state.clientCity) {
    ctx.fillText(`${isAr ? 'المدينة: ' : 'City: '} ${state.clientCity}`, textAnchorX, specY);
    specY += lineHeight;
  }

  // Price on request notice
  ctx.fillStyle = '#A48037';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(
    isAr ? 'السعر: عند الطلب (حسب الخامات والمقاسات)' : 'Price: On Request (Bespoke Specification)',
    textAnchorX,
    specY
  );

  // 6. Footer: Shareable Link & WhatsApp Contact Information
  ctx.fillStyle = '#F5F2EB';
  ctx.fillRect(40, height - 120, width - 80, 70);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, height - 120, width - 80, 70);

  ctx.fillStyle = '#2B2B2B';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isAr
      ? 'معرض تركواز للأثاث والمنسوجات الفاخرة • هاتف وواتساب: +213 556 92 91 34 • الجزائر العاصمة'
      : 'Turquoise Home Textile • Showroom & Atelier: +213 556 92 91 34 • Algiers, Algeria',
    width / 2,
    height - 85
  );

  const shareableUrl = buildShareableDesignUrl(language, state);
  ctx.fillStyle = '#A48037';
  ctx.font = '11px monospace';
  ctx.fillText(shareableUrl, width / 2, height - 65);

  // 7. Trigger Direct PNG File Download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `turquoise-design-${state.selectedProductId}.png`;
  link.href = dataUrl;
  link.click();
}
