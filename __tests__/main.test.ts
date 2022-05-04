import {run} from '../src/main'

beforeEach(() => {
  jest.resetModules()
})
afterEach(() => {
  delete process.env['INPUT_ORGANIZATION']
  delete process.env['GITHUB_REPOSITORY']
})

describe('test main', () => {
  it('Should get teams', async () => {
    expect(await run()).toBeCalled
  })
})
