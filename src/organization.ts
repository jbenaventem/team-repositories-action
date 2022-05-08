import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'
import { Organization } from '@octokit/graphql-schema'
import {
  GET_REPOSITORIES_BY_ORGANIZATION,
  GET_TEAMS_BY_ORGANIZATION
} from './query'

interface ItemConnectionResponse {
  cursor: string
  node: {
    id: string
    name: string
  }
}

interface TeamResponse {
  cursor: string
  teamId: string
  teamName: string
}

interface RepositoryResponse {
  cursor: string
  repositoryId: string
  repositoryName: string
}

/**
 * Get teams by organization
 * @param octokit as octokit
 * @param var as login
 * @returns teams
 */
export async function getTeamsByOrganization(
  octokit: InstanceType<typeof GitHub>,
  {
    login,
    endcursor
  }: {
    login: string
    endcursor: string | null
  }
): Promise<TeamResponse[]> {
  let teams: TeamResponse[] = []
  let _hasNextPage = true
  let data: string
  while (_hasNextPage) {
    core.debug('call graphql with GET_TEAMS_BY_ORGANIZATION')
    data = await octokit.graphql(GET_TEAMS_BY_ORGANIZATION, {
      login,
      endcursor,
      headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
    })
    core.debug(JSON.stringify(data))
    core.debug(`Response ${data}`)
    const jsonParsed = JSON.parse(JSON.stringify(data))
    core.info(`Json Parser ${jsonParsed}`) 
    if (jsonParsed.data.organization == null) {
      core.error(`Request failed: ${jsonParsed.errors.message}`)
      return teams
    }

    _hasNextPage = jsonParsed.data.organization.teams.pageInfo.hasNextPage
    endcursor = jsonParsed.data.organization.teams.pageInfo.endCursor

    const teamsConnection: ItemConnectionResponse[] =
      jsonParsed.data.organization.teams.edges
    teams = teamsConnection.map(item => {
      const aTeamResponse: TeamResponse = {
        cursor: item.cursor,
        teamId: item.node.id,
        teamName: item.node.name
      }
      return aTeamResponse
    })
    
    core.info(`Has Next Pages: ${_hasNextPage}`)
  }
  return teams
}

export async function getRepositoriesByOrganization(
  octokit: InstanceType<typeof GitHub>,
  {
    login,
    endcursor
  }: {
    login: string
    endcursor: string | null
  }
): Promise<RepositoryResponse[]> {
  let repositories: RepositoryResponse[] = []
  let _hasNextPage = true
  let data: string
  while (_hasNextPage) {
    core.debug("call graphql with GET_REPOSITORIES BY_ORGANIZATION ")
    data = await octokit.graphql(GET_REPOSITORIES_BY_ORGANIZATION, {
      login,
      endcursor,
      headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
    })
    const jsonParsed = JSON.parse(data)
    if (jsonParsed.data.organization == null) {
      core.error(`Request failed: ${jsonParsed.errors.message}`)
      return repositories
    }

    _hasNextPage =
      jsonParsed.data.organization.repositories.pageInfo.hasNextPage
    endcursor = jsonParsed.data.organization.repositories.pageInfo.endCursor

    const repositoriesConnection: ItemConnectionResponse[] =
      jsonParsed.data.organization.repositories.edges
    repositories = repositoriesConnection.map(item => {
      const aRepositoryResponse: RepositoryResponse = {
        cursor: item.cursor,
        repositoryId: item.node.id,
        repositoryName: item.node.name
      }
      return aRepositoryResponse
    })
    core.info(`Has Next Pages: ${_hasNextPage}`)
  }
  return repositories
}
