import * as core from '@actions/core'
import {getRepositoriesByOrganization,getTeamsByOrganization, RepositoryResponse, TeamResponse} from './organization'
import * as github from '@actions/github'
//import * from '@octokit/rest'

const baseUrl: string = 'https://api.github.com'
const inputs = async () => {
  return {
    login: core.getInput('organization'),
    token: core.getInput('token')
  }
}
export async function run(): Promise<void> {
  // Load inputs
  const settings = await inputs()
  core.debug(settings.login)
  core.debug(settings.token) 

  try {
    const octokit = github.getOctokit(settings.token)
    core.startGroup(` Getting Teams by Organization ${settings.login}`)
    core.debug(`Organization is ${settings.login} ...`)
    
    core.debug('call get Teams')
    const teams = await getTeamsByOrganization(octokit, {
      login: settings.login,
      endcursor: null
    })
    core.debug(
      `Get teams returns ${teams?.length} by the ${settings.login} organization`
    )
    
    core.debug('call get Repositories')
    const repositories = await getRepositoriesByOrganization(octokit, {
      login: settings.login,
      endcursor: null
    })
    core.debug(
      `Get Repositories returns ${repositories?.length} by the ${settings.login} organization`
    )
    if(repositories) {
      const summary = await getSummary(settings.login, repositories, octokit)
      core.setOutput('summary', summary)
    }    
  } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getSummary(
  organization: string,
  repositories: RepositoryResponse[],
  octokit: any
  ) {
    let time = new Date().toTimeString
    let summary = `Report ${time}\nRepositories in the ${organization} without teams:`
    //repositories?.forEach( async (repository) => {
    for ( const aRepository of repositories) { 
      const teams = await octokit.rest.repos.listTeams({
        owner: organization,
        repo: aRepository.repositoryName
      })
      if(teams.data.length == 0){
        core.info(`🔥 Repository ${aRepository.repositoryName} without Teams. `)
        summary += `\n\t 🔥 Repository ${aRepository.repositoryName} without Team valid.`
      }
    }
    return summary
}

run()
