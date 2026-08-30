import type { Context } from "probot";
import { buildPrBody } from "../pr-body.js";
import { uploadReleaseAssets } from "../github/release.js";

export async function handlePullRequestOpened(context: Context<"pull_request.opened">) {
  const { pull_request: pr, repository } = context.payload;

  if (!repository) {
    context.log.warn("No repository in payload");
    return;
  }

  const config = await getRepoConfig(context.octokit, repository.owner.login, repository.name, pr.head.ref);
  if (!config || !config.enabled) {
    context.log.info("use-create-pr is disabled or no config");
    return;
  }

  context.log.info({ pr: pr.number }, "use-create-pr: PR opened");

  const imageUrls = await uploadReleaseAssets(
    context.octokit,
    repository.owner.login,
    repository.name,
    pr.head.ref,
    config.images,
    `pr-${pr.number}-images`,
  );

  const body = buildPrBody({
    title: pr.title,
    features: config.features,
    releaseStatus: config.releaseStatus,
    imageBaseUrl: imageUrls,
  });

  await context.octokit.rest.pulls.update({
    owner: repository.owner.login,
    repo: repository.name,
    pull_number: pr.number,
    body,
  });

  context.log.info({ pr: pr.number }, "use-create-pr: PR body updated");
}

async function getRepoConfig(
  octokit: any,
  owner: string,
  repo: string,
  ref: string,
): Promise<UseCreatePrConfig | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".github/use-create-pr.json",
      ref,
    });

    if ("content" in data) {
      const json = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(json) as UseCreatePrConfig;
    }
  } catch (error) {
    return null;
  }

  return null;
}

interface UseCreatePrConfig {
  enabled: boolean;
  images: { localPath: string; name: string }[];
  features: {
    name: string;
    description: string;
    status: string;
    testCases: {
      summary: string;
      description: string;
      previewUrl: string;
      imageName: string;
      imageAlt: string;
    }[];
  }[];
  releaseStatus?: string;
}
