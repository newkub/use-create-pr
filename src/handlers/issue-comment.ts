import type { ProbotContext } from "probot";

export async function handleIssueCommentCreated(context: ProbotContext<"issue_comment.created">) {
  const { comment, issue, repository } = context.payload;
  if (!repository) return;

  const cmd = comment.body?.trim().toLowerCase();
  if (!cmd?.startsWith("/use-create-pr")) return;

  context.log.info({ issue: issue.number }, "use-create-pr: slash command received");

  const args = parseArgs(cmd);
  const head = args.head || `use-create-pr/${issue.number}`;
  const base = args.base || "main";
  const title = args.title || `feat: create PR from issue #${issue.number}`;

  try {
    await context.octokit.rest.pulls.create({
      owner: repository.owner.login,
      repo: repository.name,
      title,
      head,
      base,
      body: `Created from issue #${issue.number}\n\n/cc @${comment.user.login}`,
    });

    await context.octokit.rest.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: issue.number,
      body: `Created PR from this issue (head: \`${head}\`, base: \`${base}\`).`,
    });

    context.log.info({ issue: issue.number }, "use-create-pr: PR created");
  } catch (error) {
    context.log.error({ err: error }, "use-create-pr: failed to create PR");
  }
}

function parseArgs(cmd: string): Record<string, string> {
  const args: Record<string, string> = {};
  const pairs = cmd.split(/\s+/).slice(1);

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (part.startsWith("--")) {
      const key = part.slice(2);
      const value = pairs[i + 1] || "";
      args[key] = value;
      i++;
    }
  }

  return args;
}
