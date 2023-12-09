
export interface PullRequest {
    number: number
    repo: Repo
    base: Branch
    head: Branch
}

export interface Branch {
    ref: string
}

interface Repo {
    name: string
    owner: string
}