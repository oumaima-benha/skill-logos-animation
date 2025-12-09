const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'logos');
const outputDir = path.join(__dirname, '..', 'dist');
const outputFile = path.join(outputDir, 'logos.svg');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Get all SVG files
const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.svg'));

let svgContent = '';

files.forEach((file, i) => {
  let raw = fs.readFileSync(path.join(logosDir, file), 'utf8');

  // Remove XML headers & DOCTYPE
  raw = raw.replace(/<\?xml[\s\S]*?\?>/g, '')
           .replace(/<!DOCTYPE[\s\S]*?>/g, '');

  // Extract inner content of SVG
  const inner = raw
    .replace(/<svg[^>]*>/i, '')   // remove opening tag
    .replace(/<\/svg>/i, '');     // remove closing tag

  // Random placement
  const x = Math.round(Math.random() * 900);
  const y = Math.round(Math.random() * 220);

  // Random animation offset
  const dx = Math.round((Math.random() * 60) - 30);
  const dy = Math.round((Math.random() * 60) - 30);
  const duration = (4 + Math.random() * 6).toFixed(2);

  // Wrap in a group with animation
  svgContent += `
    <g id="logo-${i}" transform="translate(${x}, ${y})">
      ${inner}
      <animateTransform
        attributeName="transform"
        type="translate"
        values="${x},${y}; ${x + dx},${y + dy}; ${x},${y}"
        dur="${duration}s"
        repeatCount="indefinite"
      />
    </g>
  `;
});

// Build the final SVG with background
const finalSvg = `
<svg width="1000" height="300" viewBox="0 0 1000 300"
     xmlns="http://www.w3.org/2000/svg">

  <!-- background -->
  <rect width="1000" height="300" fill="#f5f5f5"/>

  ${svgContent}
</svg>
`;

fs.writeFileSync(outputFile, finalSvg.trim(), 'utf8');
console.log('Generated', outputFile);
