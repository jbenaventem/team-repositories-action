import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const organization: string = core.getInput('organization')
    const teams: string = core.getInput('teams')
    // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    core.debug(`Organization is ${organization} ...`)
    core.debug(`Teams allowed are ${teams} ...`) 
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}


run()
