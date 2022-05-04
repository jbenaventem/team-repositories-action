export const GET_REPOSITORIES_BY_ORGANIZATION = `query($login: String!, $endcursor: String)
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
  `

export const GET_TEAMS_BY_ORGANIZATION = `query($login: String!, $endcursor: String)
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
`
