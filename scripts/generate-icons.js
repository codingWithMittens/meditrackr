// Icon Generation Script for MedMindr PWA
// This script creates placeholder icons for PWA functionality
// In production, you would use proper graphics design tools

console.log('📱 Generating PWA icons for MedMindr...');

// Create icons directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'icon-180x180.png' } // Apple touch icon
];

// Generate SVG template for each size
iconSizes.forEach(({ size, name }) => {
  const svgIcon = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="pillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bgGradient)"/>

  <!-- Pill icon -->
  <g transform="translate(${size * 0.25}, ${size * 0.25})">
    <!-- Pill body -->
    <ellipse cx="${size * 0.25}" cy="${size * 0.25}" rx="${size * 0.15}" ry="${size * 0.25}" fill="url(#pillGradient)" stroke="#e2e8f0" stroke-width="1"/>
    <!-- Pill split line -->
    <line x1="${size * 0.1}" y1="${size * 0.25}" x2="${size * 0.4}" y2="${size * 0.25}" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Plus sign for medical -->
    <g transform="translate(${size * 0.05}, ${size * 0.05})">
      <rect x="${size * 0.08}" y="${size * 0.15}" width="${size * 0.04}" height="${size * 0.2}" fill="#3b82f6"/>
      <rect x="${size * 0.02}" y="${size * 0.19}" width="${size * 0.16}" height="${size * 0.04}" fill="#3b82f6"/>
    </g>
  </g>
</svg>`.trim();

  // Save as SVG first (easier to edit)
  const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgIcon);

  console.log(`Generated ${name} (${size}x${size})`);
});

// Create badge icon for notifications
const badgeIcon = `
<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="36" cy="36" r="34" fill="url(#badgeGradient)"/>
  <text x="36" y="45" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">💊</text>
</svg>`.trim();

fs.writeFileSync(path.join(iconsDir, 'badge-72x72.svg'), badgeIcon);

// Generate small action icons for notifications
const actionIcons = [
  { name: 'check.svg', content: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  { name: 'snooze.svg', content: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/><polyline points="12,6 12,12 16,14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  { name: 'view.svg', content: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#3b82f6" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="#3b82f6" stroke-width="2"/></svg>' }
];

actionIcons.forEach(({ name, content }) => {
  fs.writeFileSync(path.join(iconsDir, name), content);
  console.log(`Generated ${name}`);
});

// Create README for icons
const iconReadme = `
# MedMindr PWA Icons

This directory contains all the icons needed for the MedMindr Progressive Web App.

## Icon Sizes:
- **72x72**: Android small icon
- **96x96**: Android medium icon
- **128x128**: Chrome Web Store
- **144x144**: Windows Store small
- **152x152**: iPad touch icon
- **192x192**: Android large icon (minimum PWA requirement)
- **384x384**: Android extra large
- **512x512**: Chrome splash screen (minimum PWA requirement)
- **180x180**: Apple touch icon

## Badge & Action Icons:
- **badge-72x72**: Notification badge icon
- **check.svg**: Notification "taken" action
- **snooze.svg**: Notification "snooze" action
- **view.svg**: Notification "view" action

## Notes:
- All icons use SVG format for scalability
- Icons feature MedMindr branding with blue/teal gradient
- Pill icon represents medication tracking theme
- Icons are optimized for both light and dark backgrounds

## Production Recommendations:
1. Convert SVGs to PNG format for better browser compatibility
2. Use professional graphics software for final icon design
3. Test icons across different devices and screen densities
4. Consider creating app-specific variations (iOS vs Android)
`.trim();

fs.writeFileSync(path.join(iconsDir, 'README.md'), iconReadme);

console.log('\n✅ PWA icon generation complete!');
console.log('📁 Icons saved to: public/icons/');
console.log('📝 For production, convert SVGs to PNG format using tools like:');
console.log('   - Figma, Adobe Illustrator, or Inkscape');
console.log('   - Online converters like CloudConvert');
console.log('   - Command line tools like ImageMagick or Sharp');