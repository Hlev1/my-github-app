import { Probot } from 'probot'
import * as githubCommentService from '../services/comments'
import * as githubPullService from '../services/pulls'
import {pullRequestPayloadToPullRequest} from '../translators/pulls'

export function pullRequestHandler(app: Probot) {
  app.on(['pull_request.opened', 'pull_request.reopened', 'pull_request.edited'], async (context) => {
    const thisPull = pullRequestPayloadToPullRequest(context.payload.pull_request)
    const upstreamPulls = githubPullService.getAllUpstreamPulls(context.octokit, thisPull)

    githubCommentService.createIssueComment(
        context.octokit,
        (await upstreamPulls).map(pull => pull.number),
        thisPull
    )
  });
}
