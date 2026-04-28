export const userTypeDefs = `
type User {
  id: ID!
  username: String!
  email: String!
}

type Query {
    getUser: User
}

input UpdateInput {
    username: String
    password: String
    email: String 
}

type Mutation {
    registerUser(
        username: String!
        email: String!
        password: String!
    ) : User!

    loginUser(
    username: String!
    password: String!
    ): User!

    logoutUser: String!

    updateUser(id: ID!, input: UpdateInput!): User!

    deleteUser(id: ID!): String!
}
`