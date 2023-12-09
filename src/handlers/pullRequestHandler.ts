import { Probot } from 'probot'
import * as githubCommentService from '../services/comments'
import * as githubPullService from '../services/pulls'
import {pullRequestPayloadToPullRequest} from '../translators/pulls'

export function pullRequestHandler(app: Probot) {
  app.on(['pull_request.opened', 'pull_request.reopened', 'pull_request.edited'], async (context) => {
    const thisPull = pullRequestPayloadToPullRequest(context.payload.pull_request)
    const upstreamPulls = await githubPullService.getAllUpstreamPulls(context.octokit, thisPull)
    const downstreamPulls = await githubPullService.getAllDownstreamPulls(context.octokit, thisPull)

    const allPulls = [...upstreamPulls, thisPull, ...downstreamPulls]

    console.log(downstreamPulls)
    githubCommentService.createIssueComment(
        context.octokit,
        allPulls.map(pull => pull.number),
        thisPull
    )
  });
}
