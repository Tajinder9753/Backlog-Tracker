import { gql } from "@apollo/client";

export const GET_USER = gql `
    query GetUser {
        getUser {
            id
            username
            email
        }
    }
`

export const POPULAR_GAMES = gql`
    query PopularGames {
        popularGames {
            name
            background_image
            rating
        }
    }
`