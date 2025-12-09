const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'logos');
const outputDir = path.join(__dirname, '..', 'dist');
const outputFile = path.join(outputDir, 'logos.svg');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.svg'));
let svgContent = '';

files.forEach((file, i) => {
  const raw = fs.readFileSync(path.join(logosDir, file), 'utf8');

  // Strip XML prolog and outer <svg> tags so we can inline the inner markup.
  // This is a simple approach; it works for most plain SVGs.
  const withoutProlog = raw.replace(/<\?xml[\s\S]*?\?>/g, '')
                           .replace(/<!DOCTYPE[\s\S]*?>/g, '');
  const inner = withoutProlog.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '');

  // Random start position and motion
  const x = Math.round(Math.random() * 900);
  const y = Math.round(Math.random() * 220);
  const dx = Math.round((Math.random() * 60) - 30);
  const dy = Math.round((Math.random() * 60) - 30);
  const duration = (4 + Math.random() * 6).toFixed(2);

  // Wrap the inline SVG markup into a group and animate that group.
  // We use animateTransform with absolute values (so no CORS/additive issues).
  svgContent += `
  <g id="logo-${i}">
    ${inner}
    <animateTransform
      attributeName="transform"
      type="translate"
      values="${x},${y};${x + dx},${y + dy};${x},${y}"
      dur="${duration}s"
      repeatCount="indefinite"/>
  </g>\n`;
});

const finalSvg = `<svg width="1000" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="300" fill="#f5f5f5"/>
  ${svgContent}
</svg>`;

fs.writeFileSync(outputFile, finalSvg, 'utf8');
console.log('Generated', outputFile);
