import { $ } from "bun";

export async function screenshotHtml(htmlPath: string, outputPath: string, viewport = "1280,720") {
  const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;
  await $`bunx --bun playwright screenshot --viewport-size ${viewport} --wait-for-selector "#ready" --wait-for-timeout 5000 ${fileUrl} ${outputPath}`;
}
