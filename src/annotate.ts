import { generateHtml, screenshotHtml, loadConfig } from "./annotate-core";

const args = process.argv.slice(2);
let configPath = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--config" || args[i] === "-c") {
    configPath = args[i + 1];
    i++;
  }
}

if (!configPath) {
  console.error("Usage: bunx tsx src/annotate.ts --config <config.json>");
  process.exit(1);
}

const config = loadConfig(configPath);
const html = generateHtml(config);
screenshotHtml(html, config.output);
console.log(`Annotated image saved to: ${config.output}`);
