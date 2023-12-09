import {PullRequest} from '../../models/pulls/types'
import { PullRequest as PullRequestPayload } from '@octokit/webhooks-types/schema'

export const pullRequestPayloadToPullRequest = (
    payload: PullRequestPayload,
): PullRequest => {
    return {
        number: payload.number,
        repo: {
            name: payload.base.repo.name,
            owner: payload.base.repo.owner.name ?? payload.base.repo.owner.login
        },
        base: {
            ref: payload.base.ref
        },
        head: {
            ref: payload.head.ref
        },
    }
}