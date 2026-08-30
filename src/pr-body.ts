import { readFileSync, writeFileSync } from "node:fs";

interface TestCase {
  summary: string;
  description: string;
  previewUrl: string;
  imageUrl: string;
  imageAlt: string;
}

interface Feature {
  name: string;
  description: string;
  status: string;
  testCases: TestCase[];
}

interface PrBodyInput {
  title?: string;
  summary?: string;
  features: Feature[];
  typeOfChange?: string[];
  testingNotes?: string[];
  checklist?: string[];
  releaseStatus?: string;
  issueReferences?: string;
}

const inputPath = process.argv.find((a) => a.startsWith("--input="))?.slice("--input=".length);
const outputPath = process.argv.find((a) => a.startsWith("--output="))?.slice("--output=".length);

if (!inputPath || !outputPath) {
  console.error("Usage: bunx tsx src/pr-body.ts --input=pr-body.json --output=pr-body.md");
  process.exit(1);
}

const input: PrBodyInput = JSON.parse(readFileSync(inputPath, "utf-8"));

function generateSummaryTable(features: Feature[]) {
  const rows = features
    .map(
      (f, i) =>
        `| ${i + 1} | ${f.name} | ${f.status} | [Test cases](#feature-${slug(f.name)}) |`,
    )
    .join("\n");

  return `## Feature Summary

| No. | Feature | Status | Evidence |
|---|---|---|---|
${rows}`;
}

function generateFeature(feature: Feature) {
  const testCases = feature.testCases
    .map((tc, i) => {
      return `<details>
<summary>Test case ${i + 1}: ${tc.summary}</summary>

- Preview: [Open staging preview](${tc.previewUrl}) (replace with real staging URL if needed)
- Description: ${tc.description}
- Evidence:

![${tc.imageAlt}](${tc.imageUrl})

</details>`;
    })
    .join("\n\n");

  return `## Feature: ${feature.name}

### Description
${feature.description}

### Test Cases

${testCases}`;
}

function generateSection(title: string, items?: string[]) {
  if (!items || items.length === 0) return "";
  return `## ${title}

${items.map((item) => `- ${item}`).join("\n")}`;
}

const body = [
  input.summary ? `# ${input.title || "PR"}\n\n${input.summary}` : "",
  generateSummaryTable(input.features),
  "",
  "---",
  "",
  ...input.features.map(generateFeature),
  input.typeOfChange ? generateSection("Type of Change", input.typeOfChange.map((x) => `[x] ${x}`)) : "",
  input.testingNotes ? generateSection("Testing", input.testingNotes) : "",
  input.checklist ? generateSection("Checklist", input.checklist) : "",
  input.releaseStatus ? `## Release Status\n\n${input.releaseStatus}` : "",
  input.issueReferences ? `## Issue References\n\n${input.issueReferences}` : "",
]
  .filter(Boolean)
  .join("\n\n");

writeFileSync(outputPath, body);
console.log(`PR body saved to: ${outputPath}`);

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
