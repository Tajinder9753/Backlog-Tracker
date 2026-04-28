import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cookieParser from "cookie-parser";

dotenv.config();

import {typeDefs} from "./graphql/schema/index.js";
import {resolvers} from "./graphql/resolvers/index.js";

async function start()
{
    const MONGO_URL = process.env.MONGO
    try {
        await mongoose.connect(MONGO_URL)
        console.log("DB is connected!")
    }
    catch (error)
    {
        console.error("Error in connecting!", error)
    }

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    })

    await apolloServer.start()

    const app = express()
    app.use(cors( {
        origin: "http://localhost:5173",
        credentials: true
    }
    ))
    app.use(express.json())
    app.use(cookieParser())
    app.use("/graphql", expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({req, res})
    }))
    const PORT = process.env.PORT
    app.listen(PORT, ()=> {
        console.log(`app is running at ${PORT}`)
    })
}

start().catch(error => {
    console.error("server failed to start", error)
})