import type { AnnotateConfig } from "./types.js";
import { buildSvg } from "./svg.js";

export function renderHtml(inputPath: string, svgMarkup: string) {
  return `<!DOCTYPE html>
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
}

export async function generateHtml(config: AnnotateConfig) {
  const inputPath = config.input;
  const htmlPath = `${config.output}.html`;
  const svgMarkup = buildSvg(config.annotations);
  const html = renderHtml(inputPath, svgMarkup);

  await Bun.write(htmlPath, html);
  return htmlPath;
}
