import { Probot } from "probot";
import { handlePullRequest } from "./handlers/pull-request.js";
import { handleIssueCommentCreated } from "./handlers/issue-comment.js";

export default (app: Probot) => {
  app.on(["pull_request.opened", "pull_request.edited"], handlePullRequest);
  app.on("issue_comment.created", handleIssueCommentCreated);

  app.onError(async (error) => {
    app.log.error({ err: error }, "Probot error");
  });
};
