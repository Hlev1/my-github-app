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

    return (await getAllUpstreamPullsRec(octokit, pull, pulls)).reverse()
}

export async function getAllDownstreamPulls(
    octokit: InstanceType<typeof ProbotOctokit>,
    pull: PullRequest
): Promise<PullRequest[]> {
    var pulls: PullRequest[] = []

    return (await getAllDownstreamPullsRec(octokit, pull, pulls))
}

async function getAllUpstreamPullsRec(
    octokit: InstanceType<typeof ProbotOctokit>,
    pull: PullRequest,
    allPulls: PullRequest[],
): Promise<PullRequest[]> {
    const pullList = (await octokit.pulls.list({
        repo: pull.repo.name,
        owner: pull.repo.owner,
        head: `${pull.repo.owner}:${pull.base.ref}`
    })).data

    if (pullList.length == 0) {
        return allPulls
    }

    var nextPull: PullRequest = {
        number: pullList[0].number,
        repo: {
            name: pullList[0].base.repo.name,
            owner: pullList[0].base.repo.owner.name ?? pullList[0].base.repo.owner.login
        },
        base: {
            ref: pullList[0].base.ref
        },
        head: {
            ref: pullList[0].head.ref
        }
    }

    allPulls.push(nextPull)
    return getAllUpstreamPullsRec(octokit, nextPull, allPulls)
}

async function getAllDownstreamPullsRec(
    octokit: InstanceType<typeof ProbotOctokit>,
    pull: PullRequest,
    allPulls: PullRequest[],
): Promise<PullRequest[]> {
    const pullList = (await octokit.pulls.list({
        repo: pull.repo.name,
        owner: pull.repo.owner,
        base: `${pull.repo.owner}:${pull.head.ref}`
    })).data

    console.log(pullList)
    if (pullList.length == 0) {
        return allPulls
    }

    var nextPull: PullRequest = {
        number: pullList[0].number,
        repo: {
            name: pullList[0].base.repo.name,
            owner: pullList[0].base.repo.owner.name ?? pullList[0].base.repo.owner.login
        },
        base: {
            ref: pullList[0].base.ref
        },
        head: {
            ref: pullList[0].head.ref
        }
    }

    allPulls.push(nextPull)
    return getAllUpstreamPullsRec(octokit, nextPull, allPulls)
}