// Converts SVG icons to PNG using ImageMagick (magick CLI, must be installed)
const { execSync } = require('child_process');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');

const configs = [
  { src: 'icon.svg',          out: 'icon-192.png',      size: 192 },
  { src: 'icon.svg',          out: 'icon-512.png',      size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-maskable.png', size: 512 },
];

for (const { src, out, size } of configs) {
  const srcPath = path.join(iconsDir, src);
  const outPath = path.join(iconsDir, out);
  process.stdout.write(`Generating ${out} (${size}x${size})...`);
  execSync(
    `magick -background none -density 96 "${srcPath}" -resize ${size}x${size} "${outPath}"`,
    { stdio: 'pipe' }
  );
  console.log(' done');
}

console.log('All icons generated.');
