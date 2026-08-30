import { readFileSync } from "node:fs";
import { extname, basename } from "node:path";
import type { ProbotOctokit } from "probot";

export async function uploadReleaseAssets(
  octokit: ProbotOctokit,
  owner: string,
  repo: string,
  ref: string,
  images: { localPath: string; name: string }[],
  releaseTag: string,
): Promise<Record<string, string>> {
  const { data: release } = await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: releaseTag,
    name: `${releaseTag} screenshots`,
    body: `Image assets for ${releaseTag}`,
    prerelease: true,
    target_commitish: ref,
  });

  const urls: Record<string, string> = {};

  for (const image of images) {
    const data = readFileSync(image.localPath);
    const { data: asset } = await octokit.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: release.id,
      name: image.name,
      data: data as any,
      headers: {
        "content-type": contentType(image.name),
        "content-length": data.length,
      },
    });
    urls[image.name] = asset.browser_download_url;
  }

  return urls;
}

function contentType(filename: string): string {
  const ext = extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
