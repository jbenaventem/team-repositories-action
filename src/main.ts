import * as core from '@actions/core'
import {
  getRepositoriesByOrganization,
  getTeamsByOrganization
} from './organization'
import * as github from '@actions/github'

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
      `Get teams returns ${teams.length}  repositories by the ${settings.login} organization`
    )
    core.debug('call get Repositories')
    const repositories = await getRepositoriesByOrganization(octokit, {
      login: settings.login,
      endcursor: null
    })
    core.debug(
      `Get Repositories returns ${repositories.length} repositories by the ${settings.login} organization`
    )
    core.endGroup()
  } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
