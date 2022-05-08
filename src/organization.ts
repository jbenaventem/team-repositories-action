import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'
import {Maybe, Organization} from '@octokit/graphql-schema'
import {GET_REPOSITORIES_BY_ORGANIZATION,GET_TEAMS_BY_ORGANIZATION} from './query'

interface ItemConnectionResponse {
  cursor: string
  node: {
    id: string
    name: string
  }
}

export interface TeamResponse {
  cursor: string
  teamId: string
  teamName: string
}

export interface RepositoryResponse {
  cursor: string
  repositoryId: string
  repositoryName: string
}

export async function getTeamsByOrganization(
  octokit: InstanceType<typeof GitHub>,
  {
    login,
    endcursor
  }: {
    login: string
    endcursor: Maybe<string> | undefined
  }
): Promise<TeamResponse[] | undefined>{
  let teams: TeamResponse[] | undefined= []
  let _hasNextPage = true
  while (_hasNextPage) {
    core.debug('call graphql with GET_TEAMS_BY_ORGANIZATION')
    const data: any = await octokit.graphql<Organization>(
      GET_TEAMS_BY_ORGANIZATION,
      {login, endcursor}
    )
    _hasNextPage = data.organization.teams.pageInfo.hasNextPage
    endcursor = data.organization.teams.pageInfo.endCursor
    core.info(`- ${_hasNextPage}`)
    core.info(`- ${endcursor}`)
    const teamsConnection: ItemConnectionResponse[] = data.organization.teams.edges
    teams = teamsConnection.map(item => {
      const aTeamResponse: TeamResponse = {
        cursor: item.cursor,
        teamId: item.node.id,
        teamName: item.node.name
      }
      return aTeamResponse 
    })
  }
  return teams
}

export async function getRepositoriesByOrganization(
  octokit: InstanceType<typeof GitHub>,
  { login, endcursor}: {
    login: string
    endcursor: Maybe<string> | undefined
  }
):Promise<RepositoryResponse[] | undefined>{
  let _hasNextPage = true
  let repositories: RepositoryResponse[] | undefined= []
  while (_hasNextPage) {

    core.debug('call graphql with GET_REPOSITORIES BY_ORGANIZATION ')
    const data:any = await octokit.graphql(
      GET_REPOSITORIES_BY_ORGANIZATION,
      {login,endcursor})

    _hasNextPage = data.organization.repositories.pageInfo.hasNextPage
    endcursor = data.organization.repositories.pageInfo.endCursor
    core.info(`-- ${_hasNextPage}`)
    core.info(`-- ${endcursor}`)
    const repositoriesConnection: ItemConnectionResponse[] = data.organization.repositories.edges
      repositories = repositoriesConnection.map(item => {
        const aRepositoryResponse: RepositoryResponse = {
          cursor: item.cursor,
          repositoryId: item.node.id,
          repositoryName: item.node.name
        }
        return aRepositoryResponse 
      })
  }
  return repositories 
}
 