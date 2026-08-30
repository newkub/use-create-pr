import type { Annotation } from "./types.js";

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

function escapeXml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildSvg(annotations: Annotation[]) {
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
