const fs = require('fs');
const path = require('path');

const headerPath = path.join(__dirname, '../frontend/src/components/Header.jsx');
const footerPath = path.join(__dirname, '../frontend/src/components/Footer.jsx');
const indexHtmlPath = path.join(__dirname, '../frontend/index.html');
const indexCssPath = path.join(__dirname, '../frontend/src/index.css');

// 1. Clean Header.jsx
let headerContent = fs.readFileSync(headerPath, 'utf-8');

// Extract all <style> blocks
const styleBlocks = [];
const styleRegex = /<style>([\s\S]*?)<\/style>/g;
let match;
while ((match = styleRegex.exec(headerContent)) !== null) {
    styleBlocks.push(match[1]);
}

// Write styles to index.css
fs.writeFileSync(indexCssPath, styleBlocks.join('\n\n'), 'utf-8');
console.log('Wrote extracted styles to index.css');

// Remove everything before <header> or <div class="inst-header">
// Actually, let's just find the <header> or <div className="inst-header">
// In header.ejs, the header starts with <header class="inst-header">
const headerStartIdx = headerContent.indexOf('<header');
if (headerStartIdx !== -1) {
    const componentStart = headerContent.substring(0, headerContent.indexOf('return (') + 14); // up to <>\n
    headerContent = componentStart + headerContent.substring(headerStartIdx);
}
// Remove script tags at the bottom if any (or keep them inside useEffect, but for now just leave them or strip them)
fs.writeFileSync(headerPath, headerContent, 'utf-8');
console.log('Cleaned Header.jsx');

// 2. Clean Footer.jsx
let footerContent = fs.readFileSync(footerPath, 'utf-8');
// Remove </body> and </html>
footerContent = footerContent.replace(/<\/body>\s*<\/html>/gi, '');
fs.writeFileSync(footerPath, footerContent, 'utf-8');
console.log('Cleaned Footer.jsx');

// 3. Update index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const headLinks = `
    <link rel="icon" type="image/png" href="/images/unipick-favicon.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/chat-widget.css" />
    <link rel="stylesheet" href="/css/callback-widget.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
`;
indexHtml = indexHtml.replace('</head>', headLinks + '\n  </head>');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
console.log('Updated index.html');
