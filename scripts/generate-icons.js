/**
 * Icon Generation Script for TWA
 * Generates PNG icons from SVG source for Android TWA requirements
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requirements: sharp package (npm install sharp)
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Creating placeholder PNG files...');
  console.log('For production, install sharp: npm install sharp');
  console.log('Then re-run this script to generate proper PNG icons.\n');
  
  // Create placeholder files for development
  const iconsDir = path.join(__dirname, '../apps/web/public/icons');
  const sizes = [192, 512];
  const variants = ['', '-maskable'];
  
  sizes.forEach(size => {
    variants.forEach(variant => {
      const filename = `icon-${size}${variant}.png`;
      const filepath = path.join(iconsDir, filename);
      
      // Create a simple placeholder file
      fs.writeFileSync(filepath, `PNG placeholder for ${size}x${size}${variant ? ' maskable' : ''} icon`);
      console.log(`Created placeholder: ${filename}`);
    });
  });
  
  console.log('\nPlaceholder files created. Install sharp and re-run for actual PNG generation.');
  process.exit(0);
}

const SVG_SOURCE = path.join(__dirname, '../apps/web/public/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../apps/web/public/icons');

// Icon configurations
const ICONS = [
  { size: 192, suffix: '', purpose: 'any' },
  { size: 512, suffix: '', purpose: 'any' },
  { size: 192, suffix: '-maskable', purpose: 'maskable' },
  { size: 512, suffix: '-maskable', purpose: 'maskable' },
];

// Maskable icons need safe zone padding (10% on each side)
const MASKABLE_PADDING_PERCENT = 0.1;

async function generateIcon(config) {
  const { size, suffix, purpose } = config;
  const outputPath = path.join(OUTPUT_DIR, `icon-${size}${suffix}.png`);
  
  try {
    let pipeline = sharp(SVG_SOURCE).resize(size, size);
    
    if (purpose === 'maskable') {
      // For maskable icons, add padding for safe zone
      const paddedSize = Math.round(size * (1 - 2 * MASKABLE_PADDING_PERCENT));
      const padding = Math.round(size * MASKABLE_PADDING_PERCENT);
      
      pipeline = sharp(SVG_SOURCE)
        .resize(paddedSize, paddedSize)
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: '#121212' // Match the SVG background color
        });
    }
    
    await pipeline.png().toFile(outputPath);
    console.log(`✓ Generated: icon-${size}${suffix}.png (${purpose})`);
  } catch (error) {
    console.error(`✗ Failed to generate icon-${size}${suffix}.png:`, error.message);
  }
}

async function main() {
  console.log('Generating PWA icons for TWA...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Generate all icons
  for (const config of ICONS) {
    await generateIcon(config);
  }
  
  console.log('\nIcon generation complete!');
  console.log('Remember to update manifest.json with the new icon references.');
}

main().catch(console.error);
