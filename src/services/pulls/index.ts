import { ProbotOctokit } from 'probot'
import { PullRequest } from '../../models/pulls/types'

export async function getAllUpstreamPulls(
    octokit: InstanceType<typeof ProbotOctokit>,
    pull: PullRequest
): Promise<PullRequest[]> {
    var pulls: PullRequest[] = []
    const {base} = pull

    if (base.ref == 'main' || base.ref == 'master') {
        return pulls
    }

    return getAllUpstreamPullsRec(octokit, pull, pulls)
}

async function getAllUpstreamPullsRec(
    octokit: InstanceType<typeof ProbotOctokit>,
    pull: PullRequest,
    allPulls: PullRequest[],
): Promise<PullRequest[]> {
    console.log(pull)
    const [{ number, base, head }] = (await octokit.pulls.list({
        repo: pull.repo.name,
        owner: pull.repo.name,
        head: `${pull.repo.owner}:${pull.base.ref}`
    })).data

    var nextPull: PullRequest = {
        number: number,
        repo: {
            name: base.repo.name,
            owner: base.repo.owner.name ?? base.repo.owner.login
        },
        base: {
            ref: base.ref
        },
        head: {
            ref: head.ref
        }
    }

    if (nextPull) {
        allPulls.push(nextPull)
        return getAllUpstreamPullsRec(octokit, nextPull, allPulls)
    }

    return allPulls
}