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
    core.setOutput('time', new Date().toTimeString())

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
    let summary = `Repositories in the ${settings.login} without teams:`

    repositories?.forEach( async (repository) => {
      const teamsByRepository = await octokit.rest.repos.listTeams({
          owner: settings.login,
          repo: repository.repositoryName
      }).then( teams =>  {
        if(teams.data.length == 0){
          core.info(`🔥 Repository ${repository.repositoryName} without Teams. `)
          summary += `\n\t 🔥 Repository ${repository.repositoryName} without Team valid.`
        }
      }).catch(error => {
        core.error(`Error ${error.message} with the repository ${repository.repositoryName} . `)
      })
    })
    const conclusion = "Test"
    const title = `Check Teams Best practices for ${settings.login} organization`
    const createCheckRequest = {
      ...github.context.repo,
      name: "NAME",
      head_sha: "",
      status: 'completed',
      conclusion,
      output: {
          title,
          summary,
          annotations: null
      }
    }
    try {
      const octokit = github.getOctokit(settings.login)
      await octokit.rest.checks.create(createCheckRequest)
    } catch (error) {
        core.error(
            `Failed to create checks using the provided token. (${error})`
        )
        core.warning(
            `This usually indicates insufficient permissions.`
        )
    }



    core.endGroup()
  } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
