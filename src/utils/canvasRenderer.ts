import { PosterConfig, PosterTheme } from '../types';
import { POSTER_THEMES } from '../data/posterThemes';

export function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  config: PosterConfig,
  scaleFactor: number = 1
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Determine canvas pixel dimensions based on aspect ratio
  let targetWidth = 1080;
  let targetHeight = 1080;

  if (config.aspectRatio === '9:16') {
    targetWidth = 1080;
    targetHeight = 1920;
  } else if (config.aspectRatio === '16:9') {
    targetWidth = 1200;
    targetHeight = 675;
  }

  // Adjust for scale
  canvas.width = targetWidth * scaleFactor;
  canvas.height = targetHeight * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);

  const theme: PosterTheme =
    POSTER_THEMES.find((t) => t.id === config.theme) || POSTER_THEMES[0];

  const w = targetWidth;
  const h = targetHeight;

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(1, theme.bgGradient[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Subtle ambient decorative light circles
  const glowGrad1 = ctx.createRadialGradient(w * 0.8, h * 0.15, 10, w * 0.8, h * 0.15, w * 0.45);
  glowGrad1.addColorStop(0, theme.accentColor + '30');
  glowGrad1.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad1;
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.15, w * 0.45, 0, Math.PI * 2);
  ctx.fill();

  const glowGrad2 = ctx.createRadialGradient(w * 0.15, h * 0.85, 10, w * 0.15, h * 0.85, w * 0.5);
  glowGrad2.addColorStop(0, theme.highlightColor + '20');
  glowGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad2;
  ctx.beginPath();
  ctx.arc(w * 0.15, h * 0.85, w * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Subtle grid lines / geometric border frame
  ctx.strokeStyle = theme.borderStyle;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, w - 72, h - 72);

  // Corner decorative crosses
  drawCornerAccents(ctx, 36, 36, w - 72, h - 72, theme.accentColor);

  // 4. Layout coordinates depending on Aspect Ratio
  const isStory = config.aspectRatio === '9:16';
  const isLandscape = config.aspectRatio === '16:9';

  let currentY = isStory ? 180 : isLandscape ? 80 : 120;

  // BADGE PILL (e.g., "⚡ FLASH SALE 24H")
  if (config.badgeText.trim()) {
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    const badgeText = config.badgeText.toUpperCase();
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeW = badgeMetrics.width + 56;
    const badgeH = 50;
    const badgeX = (w - badgeW) / 2;

    // Draw badge pill
    ctx.fillStyle = theme.badgeBg;
    roundRect(ctx, badgeX, currentY, badgeW, badgeH, 25);
    ctx.fill();

    // Badge text
    ctx.fillStyle = theme.badgeTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, w / 2, currentY + badgeH / 2);

    currentY += badgeH + (isStory ? 50 : isLandscape ? 30 : 40);
  }

  // BUSINESS NAME
  if (config.businessName.trim()) {
    ctx.font = '600 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = theme.accentColor;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText(config.businessName.toUpperCase(), w / 2, currentY);
    ctx.letterSpacing = '0px';

    currentY += isStory ? 60 : isLandscape ? 35 : 45;
  }

  // MAIN HEADLINE
  if (config.mainHeadline.trim()) {
    const headlineFontSize = isLandscape ? 44 : isStory ? 64 : 58;
    ctx.font = `800 ${headlineFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = theme.headlineColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxTextWidth = w - 160;
    const headlineLines = wrapText(ctx, config.mainHeadline, maxTextWidth);
    const lineHeight = headlineFontSize * 1.15;

    for (const line of headlineLines) {
      ctx.fillText(line, w / 2, currentY);
      currentY += lineHeight;
    }

    currentY += isStory ? 40 : isLandscape ? 20 : 30;
  }

  // CENTRAL HIGHLIGHT CARD (HUGE PROMO OFFER e.g., "BUY 1 GET 1 FREE" or "50% OFF")
  if (config.highlightOffer.trim()) {
    const cardMarginX = isLandscape ? 120 : 70;
    const cardW = w - cardMarginX * 2;
    const cardH = isStory ? 340 : isLandscape ? 170 : 250;
    const cardX = cardMarginX;
    const cardY = currentY;

    // Draw Card Background
    ctx.fillStyle = theme.cardBg;
    roundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fill();

    ctx.strokeStyle = theme.highlightColor;
    ctx.lineWidth = 3;
    roundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.stroke();

    // Offer Text inside card
    const offerFontSize = isLandscape ? 52 : isStory ? 82 : 72;
    ctx.font = `900 ${offerFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = theme.highlightColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const offerLines = wrapText(ctx, config.highlightOffer.toUpperCase(), cardW - 60);
    const totalLinesH = offerLines.length * (offerFontSize * 1.1);
    let startLineY = cardY + (cardH - totalLinesH) / 2 + (offerFontSize * 0.5);

    for (const line of offerLines) {
      ctx.fillText(line, w / 2, startLineY);
      startLineY += offerFontSize * 1.1;
    }

    currentY += cardH + (isStory ? 50 : isLandscape ? 25 : 35);
  }

  // SUB-HEADLINE / SUPPORTING TEXT
  if (config.subHeadline.trim()) {
    const subFontSize = isLandscape ? 22 : 28;
    ctx.font = `500 ${subFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const subLines = wrapText(ctx, config.subHeadline, w - 180);
    const subLineHeight = subFontSize * 1.4;

    for (const line of subLines) {
      ctx.fillText(line, w / 2, currentY);
      currentY += subLineHeight;
    }

    currentY += isStory ? 40 : isLandscape ? 20 : 30;
  }

  // FOOTER SECTION: Contact / WhatsApp Badge & QR Mockup
  const footerY = h - (isStory ? 230 : isLandscape ? 120 : 160);

  // Contact Pill (e.g. "WhatsApp to Order: 082 123 4567")
  if (config.contactInfo.trim()) {
    const contactText = config.contactInfo;
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    const contactMetrics = ctx.measureText(contactText);
    const pillW = contactMetrics.width + 60;
    const pillH = 54;
    const pillX = (w - pillW) / 2;
    const pillY = footerY;

    // Background pill
    ctx.fillStyle = '#10b981'; // WhatsApp Emerald Green
    roundRect(ctx, pillX, pillY, pillW, pillH, 27);
    ctx.fill();

    // Phone / Chat icon indicator
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💬 ' + contactText, w / 2, pillY + pillH / 2);
  }

  // TERMS & CONDITIONS
  if (config.terms.trim()) {
    const termsY = h - 60;
    ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.terms, w / 2, termsY);
  }

  // WATERMARK (ONLY ON FREE PLAN)
  if (config.watermark) {
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('⚡ PromoPilot Free Plan', w - 50, h - 45);
  }
}

function drawCornerAccents(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  const len = 20;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(x - 5, y + len);
  ctx.lineTo(x - 5, y - 5);
  ctx.lineTo(x + len, y - 5);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(x + w + 5 - len, y - 5);
  ctx.lineTo(x + w + 5, y - 5);
  ctx.lineTo(x + w + 5, y + len);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(x - 5, y + h - len);
  ctx.lineTo(x - 5, y + h + 5);
  ctx.lineTo(x + len, y + h + 5);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(x + w + 5 - len, y + h + 5);
  ctx.lineTo(x + w + 5, y + h + 5);
  ctx.lineTo(x + w + 5, y + h + 5);
  ctx.stroke();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = 'promopilot-poster.png',
  format: 'image/png' | 'image/jpeg' = 'image/png'
) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(format, 0.95);
  link.click();
}
