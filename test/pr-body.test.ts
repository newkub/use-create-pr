import { describe, expect, it } from "bun:test";
import { buildPrBody } from "../src/pr-body";

const features = [
  {
    name: "Docs",
    description: "Docs migration",
    status: "Ready",
    testCases: [
      {
        summary: "Homepage loads",
        description: "See homepage",
        previewUrl: "http://localhost:4173",
        imageName: "homepage",
        imageAlt: "docs homepage",
      },
    ],
  },
];

describe("buildPrBody", () => {
  it("includes summary table", () => {
    const body = buildPrBody({
      title: "Release v1",
      summary: "This is a test PR",
      features,
      imageBaseUrl: { homepage: "https://example.com/homepage.png" },
    });
    expect(body).toContain("## Feature Summary");
    expect(body).toContain("<details>");
    expect(body).toContain("https://example.com/homepage.png");
  });

  it("replaces imageName with imageBaseUrl", () => {
    const body = buildPrBody({
      features,
      imageBaseUrl: { homepage: "https://example.com/homepage.png" },
    });
    expect(body).toContain("https://example.com/homepage.png");
  });
});
