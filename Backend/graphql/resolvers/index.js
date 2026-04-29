import { gameResolver } from './game.js'
import { userResolvers } from './user.js'

export const resolvers = [userResolvers, gameResolver]