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
    query PopularGames($pageNumber: Int!) {
        popularGames(pageNumber: $pageNumber) {
            id
            name
            background_image
            rating
        }
    }
`

export const SEARCH_GAME = gql`
    query SearchGame ($name: String!) {
        searchGame (name: $name) {
            name
            background_image
            rating
        }
    }
`