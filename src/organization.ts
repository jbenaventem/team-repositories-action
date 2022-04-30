import { Octokit } from '@octokit/core'

type Options = {
    owner: string;
  };

export async function run(
    octokit: Octokit,
    organization: any
) {

    //Teams By Organization
    const teams = `query($organization: String!)
    {
      organization(login: $organization) {
        teams(first: 10) {
          totalCount
          nodes {
            id
            name
          }
          
        }
      }
    }`
    //Get Repositories by Organization
    const repositories = `query($organization: String!)
    {
      organization(login: $organization) {
        repositories(first:100) {
          totalCount
          nodes {
            id
            name
          }
        }
      }
    }`;


}

