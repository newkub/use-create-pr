import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

export interface ArrowAnnotation {
  type: "arrow";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
}

export interface TextAnnotation {
  type: "text";
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
}

export interface BoxAnnotation {
  type: "box";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export type Annotation = ArrowAnnotation | TextAnnotation | BoxAnnotation;

export interface AnnotateConfig {
  input: string;
  output: string;
  annotations: Annotation[];
}

const markerDefs = `
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
    </marker>
    <marker id="arrowhead-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
    </marker>
    <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
    </marker>
  </defs>
`;

function buildSvg(annotations: Annotation[]) {
  let svg = `${markerDefs}`;

  for (const a of annotations) {
    if (a.type === "arrow") {
      const color = a.color || "#ef4444";
      const marker = color === "#3b82f6" ? "arrowhead-blue" : color === "#22c55e" ? "arrowhead-green" : "arrowhead";
      svg += `<line x1="${a.fromX}" y1="${a.fromY}" x2="${a.toX}" y2="${a.toY}" stroke="${color}" stroke-width="3" marker-end="url(#${marker})" />`;
    } else if (a.type === "text") {
      const color = a.color || "#ef4444";
      const fontSize = a.fontSize || 18;
      svg += `<text x="${a.x}" y="${a.y}" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="${fontSize}" fill="${color}" stroke="#fff" stroke-width="0.6" paint-order="stroke">${escapeXml(a.text)}</text>`;
    } else if (a.type === "box") {
      const color = a.color || "#ef4444";
      svg += `<rect x="${a.x}" y="${a.y}" width="${a.width}" height="${a.height}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="6,4" />`;
    }
  }

  return svg;
}

function escapeXml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function generateHtml(config: AnnotateConfig) {
  const inputPath = resolve(config.input);
  const htmlPath = `${config.output}.html`;

  const svgMarkup = buildSvg(config.annotations);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { position: relative; display: inline-block; }
    #bg { display: block; }
    #overlay { position: absolute; top: 0; left: 0; }
  </style>
</head>
<body>
  <img id="bg" src="file:///${inputPath.replace(/\\/g, "/")}" />
  <svg id="overlay"></svg>
  <div id="ready" style="display:none">ready</div>
  <script>
    const img = document.getElementById('bg');
    const svg = document.getElementById('overlay');
    img.onload = function() {
      svg.setAttribute('width', img.naturalWidth);
      svg.setAttribute('height', img.naturalHeight);
      svg.setAttribute('viewBox', '0 0 ' + img.naturalWidth + ' ' + img.naturalHeight);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.innerHTML = ${JSON.stringify(svgMarkup)};
      document.getElementById('ready').style.display = 'block';
    };
    if (img.complete) img.onload();
  </script>
</body>
</html>
`;

  writeFileSync(htmlPath, html);
  return htmlPath;
}

export function screenshotHtml(htmlPath: string, outputPath: string, viewport = "1280,720") {
  const cmd = `bunx --bun playwright screenshot --viewport-size ${viewport} --wait-for-selector "#ready" --wait-for-timeout 5000 "file:///${htmlPath.replace(/\\/g, "/")}" "${outputPath}"`;
  execSync(cmd, { stdio: "inherit" });
}

export function loadConfig(path: string): AnnotateConfig {
  return JSON.parse(readFileSync(path, "utf-8"));
}
