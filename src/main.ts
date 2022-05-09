import * as core from '@actions/core'
import {getRepositoriesByOrganization,getTeamsByOrganization, TeamResponse} from './organization'
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
    
    let summary = `Report ${new Date().toTimeString } \nRepositories in the ${settings.login} without teams:`

    repositories?.forEach( async (repository) => {
      const teams = await octokit.rest.repos.listTeams({
          owner: settings.login,
          repo: repository.repositoryName
      })
      if(teams.data.length == 0){
        core.info(`🔥 Repository ${repository.repositoryName} without Teams. `)
        summary += `\n\t 🔥 Repository ${repository.repositoryName} without Team valid.`
        core.setOutput('summary', summary)
      }
    })
   } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
