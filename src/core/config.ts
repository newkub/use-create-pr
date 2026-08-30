import type { AnnotateConfig } from "./types.js";

export async function loadConfig(path: string): Promise<AnnotateConfig> {
  const file = Bun.file(path);
  const text = await file.text();
  return JSON.parse(text);
}
