import { ProbotOctokit } from 'probot'
import { PullRequest } from '../../models/pulls/types'

export function createIssueComment(
    octokit: InstanceType<typeof ProbotOctokit>, 
    chainedPullRequests: number[],
    pullRequest: PullRequest
) {
    const {repo} = pullRequest
    octokit.issues.createComment({
        repo: repo.name, 
        owner: repo.owner,
        issue_number: pullRequest.number,
        body: buildComment(chainedPullRequests)
    });
}

function buildComment(chainedPullRequests: number[]): string {
    var comment = '- main\n';

    chainedPullRequests.forEach((item, index) => {
        const indentation = '  '.repeat(index);

        comment += `  ${indentation}- #${item}\n`
    });

    return comment
}