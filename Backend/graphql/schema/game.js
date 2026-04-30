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
    rawgId: String!
    name: String!
    description: String
    background_image: String
    rating: Float
    myRating: Float
    released: String
    platforms: [GamePlatform]
    myPlatforms: [GamePlatform]
    genres: [Genre]
    review: String
    owned: Boolean
    status: String
    }

    input UpdateGameInput {
        myRating: Float
        myPlatforms: [ID!]
        review: String
        status: String
    }

    input AddGameInput {
        rawgId: String!
        name: String!
        description: String
        background_image: String
        myRating: Float
        released: String
        platforms: [ID!]
        myPlatforms: [ID!]
        genres: [ID!]
        review: String
        status: String!
        owned: Boolean!
    }

    type Query {
        getGames: [Game!]!
        getGame(id: ID!): Game!
        popularGames(pageNumber: Int!): [Game!]!
        searchGame(name: String!): [Game!]!
        gameDetails(gameID: String!): Game!
    }

    type Mutation {
        addGame(input: AddGameInput!): Game!
        updateGame(id: ID!, input: UpdateGameInput!): Game!
        deleteGame(id: ID!): String!
    }
`