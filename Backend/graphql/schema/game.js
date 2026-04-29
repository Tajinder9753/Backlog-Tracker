export const gameTypeDefs = `
    type Platform {
    id: ID!
    name: String!
    slug: String!
    }

    type GamePlatform {
    platform: Platform!
    }

    type Genre {
    id: ID!
    name: String!
    }

    type Game {
    id: ID!
    name: String!
    background_image: String
    rating: Float
    released: String
    platforms: [GamePlatform]
    myPlatforms: [GamePlatform]
    genres: [Genre]
    review: String
    }

    input UpdateGameInput {
        name: String
        rating: Float
        myPlatforms: [ID!]
        review: String
    }

    input AddGameInput {
        name: String!
        background_image: String
        rating: Float
        released: String
        platforms: [ID!]
        myPlatforms: [ID!]
        genres: [ID!]
        review: String
    }

    type Query {
        getGames: [Game!]!
        getGame(id: ID!): Game!
        popularGames: [Game!]!
    }

    type Mutation {
        addGame(input: AddGameInput!): Game!
        updateGame(id: ID!, input: UpdateGameInput!): Game!
        deleteGame(id: ID!): String!
    }
`