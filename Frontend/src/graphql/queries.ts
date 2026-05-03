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
            myRating
        }
    }
`

export const SEARCH_GAME = gql`
    query SearchGame ($name: String!) {
        searchGame (name: $name) {
            id
            name
            background_image
            rating
        }
    }
`

export const GAME_DETAILS = gql`
    query GameDetails($gameID: String!){
        gameDetails(gameID: $gameID) {
            id
            mongoId
            name
            background_image
            rating
            myRating
            released
            platforms {
                platform {
                    id
                    name
                }
            }
            myPlatforms
            genres {
                id
                name
            }
            review
            description
            owned
            status
        }
    }
`