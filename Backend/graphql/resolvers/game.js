import dotenv from 'dotenv';
import {Game} from "../../models/Game.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const gameResolver = {
    Query: {
        getGames: async (_, args, context) => {
            // Verify the JWT token
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error('Not Logged In');
            }
            const payload = jwt.verify(token, JWT_SECRET);

            const userGames = await Game.find({ user: payload._id }).sort({ createdAt: -1 });
            
            if (!userGames)
            {
                throw new Error ("No Games Found");
            }

            return userGames;
        },

        getGame: async(_, args, context) => {
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error('Not Logged In');
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const game = await Game.findOne({ _id: args.id, user: payload._id });

            if (!game) {
                throw new Error('Game Not Found');
            }

            return game;
        }
    },

    Mutation: {
        addGame: async (_, args, context) => {
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error('Not Logged In');
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const game = new Game({
                ...args.input,
                user: payload._id,
                createdAt: new Date()
            });
            await game.save();
            return game;
        },

        updateGame: async (_, args, context) => {
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error('Not Logged In');
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const game = await Game.findById(args.id);
            if (!game) {
                throw new Error('Game Not Found');
            }

            if (game.user != payload._id) {
                throw new Error('Not Authorized');
            }
            
            return await Game.findByIdAndUpdate(args.id, args.input);
        },

        deleteGame: async(_, args, context) => {
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error('Not Logged In');
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const game = await Game.findById(args.id);
            if (!game) {
                throw new Error('Game Not Found');
            }

            if (game.user != payload._id) {
                throw new Error('Not Authorized');
            }

            await Game.findByIdAndDelete(args.id);
            return "Game Deleted Successfully";
        }
    }
}