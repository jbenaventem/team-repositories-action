import {getOctokit} from '@actions/github'
import {
  getTeamsByOrganization,
  getRepositoriesByOrganization
} from '../src/organization'
import {
  GET_REPOSITORIES_BY_ORGANIZATION,
  GET_TEAMS_BY_ORGANIZATION
} from '../src/query'

describe('Test Queries On Organization', () => {
  describe('getTeamsByOrganization Testing', () => {
    const variables = {login: 'test-organization', endcursor: 'idcursor'}
    const with_only_login = {login: 'test-organization', endcursor: null}
    const octokit = getOctokit('github-token')
    const not_found = `{
      "data": {
        "organization": null
      },
      "errors": [
        {
          "type": "NOT_FOUND",
          "path": [
            "organization"
          ],
          "locations": [
            {
              "line": 3,
              "column": 3
            }
          ],
          "message": "Could not resolve to an Organization with the login of 'santander-group-not-found'."
        }
      ]
    }`
    const retuned = `
	{
      "data": {
        "organization": {
          "name": "Global CTO",
          "id": "MDEyOk9yZ2FuaXphdGlvbjY3NDI1MjY4",
          "teams": {
            "totalCount": 12,
            "pageInfo": {
              "endCursor": "Y3Vyc29yOnYyOpMCqHN0cmF0ZWd5zgBW34Y=",
              "startCursor": "Y3Vyc29yOnYyOpMCqGFkb3B0aW9uzgBWcOc=",
              "hasNextPage": false
            },
            "edges": [
              {
                "cursor": "Y3Vyc29yOnYyOpMCqGFkb3B0aW9uzgBWcOc=",
                "node": {
                  "id": "T_kwDOBATT9M4AVnDn",
                  "name": "adoption"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCq2FsbC1tZW1iZXJzzgA75Sw=",
                "node": {
                  "id": "MDQ6VGVhbTM5MjUyOTI=",
                  "name": "all-members"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCqGFsbW1jLW9wzgBPEOQ=",
                "node": {
                  "id": "T_kwDOBATT9M4ATxDk",
                  "name": "almmc-op"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCrGFyY2hpdGVjdHVyZc4AVnDp",
                "node": {
                  "id": "T_kwDOBATT9M4AVnDp",
                  "name": "architecture"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCqmF1dG9tYXRpb27OAFZWBw==",
                "node": {
                  "id": "T_kwDOBATT9M4AVlYH",
                  "name": "automation"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCpGRhdGHOAFZ8Nw==",
                "node": {
                  "id": "T_kwDOBATT9M4AVnw3",
                  "name": "data"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCt2VudGVycHJpc2UtYXJjaGl0ZWN0dXJlzgBW358=",
                "node": {
                  "id": "T_kwDOBATT9M4AVt-f",
                  "name": "enterprise-architecture"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCrW9ic2VydmFiaWxpdHnOAFZw6w==",
                "node": {
                  "id": "T_kwDOBATT9M4AVnDr",
                  "name": "observability"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCrlBsYXRmb3JtIGJ1aWxkzgA-nRA=",
                "node": {
                  "id": "MDQ6VGVhbTQxMDM0NDA=",
                  "name": "Platform build"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCqXByb2Nlc3Nlc84AVnDt",
                "node": {
                  "id": "T_kwDOBATT9M4AVnDt",
                  "name": "processes"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCrHB1YmxpYy1jbG91ZM4AVnAn",
                "node": {
                  "id": "T_kwDOBATT9M4AVnAn",
                  "name": "public-cloud"
                }
              },
              {
                "cursor": "Y3Vyc29yOnYyOpMCqHN0cmF0ZWd5zgBW34Y=",
                "node": {
                  "id": "T_kwDOBATT9M4AVt-G",
                  "name": "strategy"
                }
              }
            ]
          }
        }
      }
    }
	`
	
    beforeEach(() => {
      jest.spyOn<any, string>(octokit, 'graphql').mockResolvedValue(retuned)
    })

    it('uses the correct query', () => {
      expect(GET_TEAMS_BY_ORGANIZATION).toMatchSnapshot(`
        "query($login: String!, $endcursor: String)
        {
          organization(login: $login) {
            name
            id
            teams(first: 100, after: $endcursor) {
              totalCount
              pageInfo {
                endCursor
                startCursor
                hasNextPage
              }
              edges {
                cursor
                node {
                  id
                  name
                }
              }     
            }
          }
        }
        "
      `)
    })
    it('calls octokit.graphql with the correct query and variables', async () => {
      await getTeamsByOrganization(octokit, variables)
      expect(octokit.graphql).toBeCalledTimes(1)
      expect(octokit.graphql).toHaveBeenCalledWith(GET_TEAMS_BY_ORGANIZATION, {
        login: 'test-organization',
        endcursor: 'idcursor',
        headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
      })
    })
    it('calls octokit.graphql with the correct query and only login var', async () => {
      await getTeamsByOrganization(octokit, with_only_login)
      expect(octokit.graphql).toBeCalledTimes(1)
      expect(octokit.graphql).toHaveBeenCalledWith(GET_TEAMS_BY_ORGANIZATION, {
        login: 'test-organization',
        endcursor: null,
        headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
      })
    })
    it('calls getTeamsOrganization must respond an TeamResponse Object', async () => {
      expect((await getTeamsByOrganization(octokit, variables)).length).toEqual(
        12
      )
      expect(octokit.graphql).toBeCalledTimes(1)
    })

    it('calls getTeams organization must response null when org not not found', async () => {
      jest.spyOn<any, string>(octokit, 'graphql').mockResolvedValue(not_found)
      expect((await getTeamsByOrganization(octokit, variables)).length).toEqual(0)
      expect(octokit.graphql).toBeCalledTimes(1)
    })
  })
  describe('Get epositories By organization Testing', () => {
    const variables = {login: 'test-organization', endcursor: 'idcursor'}
    const with_only_login = {login: 'test-organization', endcursor: null}
    const octokit = getOctokit('github-token')
    const not_found = `{
      "data": {
        "organization": null
      },
      "errors": [
        {
          "type": "NOT_FOUND",
          "path": [
            "organization"
          ],
          "locations": [
            {
              "line": 3,
              "column": 3
            }
          ],
          "message": "Could not resolve to an Organization with the login of 'santander-group-not-found'."
        }
      ]
    }`
    const retuned = `{
	  "data": {
		"organization": {
		  "name": "Global CTO",
		  "id": "MDEyOk9yZ2FuaXphdGlvbjY3NDI1MjY4",
		  "repositories": {
			"totalCount": 40,
			"pageInfo": {
			  "endCursor": "Y3Vyc29yOnYyOpHOHRob-g==",
			  "startCursor": "Y3Vyc29yOnYyOpHOECqk2A==",
			  "hasNextPage": false
			},
			"edges": [
			  {
				"cursor": "Y3Vyc29yOnYyOpHOECqk2A==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkyNzEyMzAxNjg=",
				  "name": "wiki-docs"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOETFrLw==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkyODg0NTEzNzU=",
				  "name": "documentacion-interna"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEUhScw==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkyODk5NTIzNzE=",
				  "name": "automationarchitecture"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEcGuSg==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkyOTc5MDU3Mzg=",
				  "name": "jfrog-wiki-docs"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEi1e2g==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMDQ5NjMyOTA=",
				  "name": "csa-guardrails-azure-policy"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEjw40Q==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMDU5MzY1OTM=",
				  "name": "protect-iam-azure-serviceprincipalmanager"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEjxPKw==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMDU5NDIzMTU=",
				  "name": "csa-guardrails-tfe"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEkv7Eg==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMDY5NjkzNjI=",
				  "name": "csa.az.modules.app-service-sm"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEkv-uw==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMDY5NzAyOTk=",
				  "name": "csa.az.modules.application-insights-sm"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOEn4h_g==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzMTAyNTYxMjY=",
				  "name": "api-global-user-catalog-database"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFcT7iQ==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNjUyMzA5ODU=",
				  "name": "csa-guardrails-aws-dome9"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFmTpBQ==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzU3MTIwMDU=",
				  "name": "chatbot-aws"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFmoWug==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzYwNTEzODY=",
				  "name": "grid-day1"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFnKzlg==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzY2MTU4MzA=",
				  "name": "grid-day2"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFoC7bg==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzc1MzUzNDI=",
				  "name": "o365-sp-webpart1"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFoDdQQ==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzc1NDQwMDE=",
				  "name": "natting"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFpZ17A==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzNzg5NTkzNDA=",
				  "name": "natting2"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOFvsNtw==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzODU1NTE3OTk=",
				  "name": "PoC-NonRoutableAddressing"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOF2Zb3Q==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzOTI1ODQxNTc=",
				  "name": "framework-testing-project"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOF2i_2g==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzOTI3NDA4MjY=",
				  "name": "o365-powerplatform-solution1"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOF386fQ==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnkzOTQyMTQwMTM=",
				  "name": "-o365-powerplatform-solution2"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOGCXGBQ==",
				"node": {
				  "id": "MDEwOlJlcG9zaXRvcnk0MDUxMjg3MDk=",
				  "name": "o365-powerplatform-solution2"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOGIMxaQ==",
				"node": {
				  "id": "R_kgDOGIMxaQ",
				  "name": "o365-sp-deployps"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOGR-o3Q==",
				"node": {
				  "id": "R_kgDOGR-o3Q",
				  "name": "o365-sp-deploypackage"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOG7qd2g==",
				"node": {
				  "id": "R_kgDOG7qd2g",
				  "name": "cto-tech-radar-gen"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOG95BFw==",
				"node": {
				  "id": "R_kgDOG95BFw",
				  "name": "serverlessapp"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOG_58ww==",
				"node": {
				  "id": "R_kgDOG_58ww",
				  "name": "github-push-action"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHAVrZg==",
				"node": {
				  "id": "R_kgDOHAVrZg",
				  "name": "wkf-terraform"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHAbSkw==",
				"node": {
				  "id": "R_kgDOHAbSkw",
				  "name": "terraform-test-github-actions"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHCbfEw==",
				"node": {
				  "id": "R_kgDOHCbfEw",
				  "name": "at-refapp-angular"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHDXJYA==",
				"node": {
				  "id": "R_kgDOHDXJYA",
				  "name": "at-serverlessandmesh"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHFC3LA==",
				"node": {
				  "id": "R_kgDOHFC3LA",
				  "name": "WebGoat"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHFvS0g==",
				"node": {
				  "id": "R_kgDOHFvS0g",
				  "name": "cop-automation-iac"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHKF5VA==",
				"node": {
				  "id": "R_kgDOHKF5VA",
				  "name": "itsm-release-management"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHNpQnQ==",
				"node": {
				  "id": "R_kgDOHNpQnQ",
				  "name": "ChaosStudio-PoT"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHNsRPA==",
				"node": {
				  "id": "R_kgDOHNsRPA",
				  "name": "codespaces-demo"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHN9_-A==",
				"node": {
				  "id": "R_kgDOHN9_-A",
				  "name": "jnlp-agent"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHOxVLA==",
				"node": {
				  "id": "R_kgDOHOxVLA",
				  "name": "cto-organization-best-practices-app"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHO4nUA==",
				"node": {
				  "id": "R_kgDOHO4nUA",
				  "name": "cloud-observatory"
				}
			  },
			  {
				"cursor": "Y3Vyc29yOnYyOpHOHRob-g==",
				"node": {
				  "id": "R_kgDOHRob-g",
				  "name": "cloud_architecture"
				}
			  }
			]
		  }
		}
	  }
	}`

    beforeEach(() => {
      jest.spyOn<any, string>(octokit, 'graphql').mockResolvedValue(retuned)
    })

    it('uses the correct query', () => {
      expect(GET_REPOSITORIES_BY_ORGANIZATION).toMatchSnapshot(`
        "query($login: String!, $endcursor: String)
		{
		  organization(login: $login) {
			name
			id
			repositories(first: 100, after: $endcursor) {
			  totalCount
			  
			  pageInfo {
				endCursor
				startCursor
				hasNextPage
			  }
			  edges {
				cursor
				node {
				  id
				  name
				}
			  }     
			}
		  }
		}
		"
      `)
    })
    it('calls octokit.graphql with the correct query and variables', async () => {
      await getRepositoriesByOrganization(octokit, variables)
      expect(octokit.graphql).toBeCalledTimes(1)
      expect(octokit.graphql).toHaveBeenCalledWith(
        GET_REPOSITORIES_BY_ORGANIZATION,
        {
          login: 'test-organization',
          endcursor: 'idcursor',
          headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
        }
      )
    })
    it('calls octokit.graphql with the correct query and only login var', async () => {
      await getRepositoriesByOrganization(octokit, with_only_login)
      expect(octokit.graphql).toBeCalledTimes(1)
      expect(octokit.graphql).toHaveBeenCalledWith(
        GET_REPOSITORIES_BY_ORGANIZATION,
        {
          login: 'test-organization',
          endcursor: null,
          headers: {Accept: 'application/vnd.github.ocelot-preview+json'}
        }
      )
    })
    it('calls getRepositoriesByOrganization must respond an RepositoryResponse Object', async () => {
      expect(
        (await getRepositoriesByOrganization(octokit, variables)).length
      ).toEqual(40)
      expect(octokit.graphql).toBeCalledTimes(1)
    })

    it('calls getRepositoriesByOrganization must response null when org not not found', async () => {
      jest.spyOn<any, string>(octokit, 'graphql').mockResolvedValue(not_found)
      expect(
        (await getRepositoriesByOrganization(octokit, variables)).length
      ).toEqual(0)
      expect(octokit.graphql).toBeCalledTimes(1)
    })
  })
})
