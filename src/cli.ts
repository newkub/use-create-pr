#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { buildPrBody, type PrBodyInput } from "./pr-body.js";

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const index = args.findIndex((a) => a === `--${name}`);
  if (index === -1) return undefined;
  return args[index + 1];
}

const input = getArg("input");
const output = getArg("output") || "/dev/stdout";

if (!input) {
  console.error("Usage: bunx tsx src/cli.ts --input pr-body.json [--output pr-body.md]");
  process.exit(1);
}

const data: PrBodyInput = JSON.parse(readFileSync(input, "utf-8"));
const body = buildPrBody(data);

if (output === "/dev/stdout") {
  console.log(body);
} else {
  writeFileSync(output, body);
  console.log(`PR body written to ${output}`);
}
