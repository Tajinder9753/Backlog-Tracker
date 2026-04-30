import dotenv from 'dotenv';
import {Game} from "../../models/Game.js";
import jwt from 'jsonwebtoken';

dotenv.config();

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
        },

        popularGames: async (_, args, context) => {
        try {
            const res = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&ordering=-rating&page_size=20&page=${args.pageNumber}`
            );
            const data = await res.json();
            const rawgGames = data.results;

            const token = context.req.cookies.token;
            if (!token) return rawgGames;

            const payload = jwt.verify(token, JWT_SECRET);
            const rawgIds = rawgGames.map(g=> String(g.id));
            const savedGames = await Game.find({
                user: payload._id,
                rawgId: {$in: rawgIds}
            });

            const savedMap = {};
            savedGames.forEach(g=> {savedMap[g.rawgId] = g;});

            return rawgGames.map(game => ({
                ...game,
                myRating: savedMap[String(game.id)]?.myRating ?? null
            }));

        } catch (err) {
            console.error('RAWG fetch error:', err);
            throw new Error('Failed to fetch games from RAWG');
        }
        },

        searchGame: async(_, args) => {

            try {
                const res = await fetch (
                    `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${args.name}&page_size=10`
                );
                const data = await res.json();
                return data.results;
            } catch (err) {
                console.error("RAWG fetch error: ", err);
                throw new Error ("Failed to fetch game from RAWG");
            }
        },

        gameDetails: async (_, args, context) => {
            try {
                const res = await fetch (
                    `https://api.rawg.io/api/games/${args.gameID}?key=${process.env.RAWG_API_KEY}`
                );
                const data = await res.json();

                const token = context.req.cookies.token;
                if (!token) return data;

                const payload = jwt.verify(token, JWT_SECRET);
                const savedGame = await Game.findOne({
                    user: payload._id,
                    rawgId: String(args.gameID)
                })

                return {
                    ...data,
                    mongoId: savedGame?._id ?? null,
                    myRating: savedGame?.myRating ?? null,
                    review: savedGame?.review ?? null,
                    myPlatforms: savedGame?.myPlatforms ?? null,
                    status: savedGame?.status ?? null,
                    owned: savedGame?.owned ?? null
                }
            } catch (err) {
                console.error("RAWG fetch error: ", err);
                throw new Error ("failed to fetch game from RAWG")
            }
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
            return await Game.findByIdAndDelete(args.id);
        }
    }
}