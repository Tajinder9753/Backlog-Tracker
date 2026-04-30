import dotenv from "dotenv";
import { User } from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
const jwtExpirySeconds = Number(process.env.JWT_EXPIRY);

export const userResolvers = {
    Query: {
        getUser: async (_, __, context) => {
            const token = context.req.cookies.token;
            if (!token) return null;

            try {
                const payload = jwt.verify(token, JWT_SECRET);
                return await User.findById(payload._id);
            } catch (error) {
                return null;
            }
        }
    },

    Mutation: {
        registerUser: async (_, args) => {
            const existingUser = await User.findOne({ username: args.username });
            if (existingUser) 
            {
                throw new Error("Username already exists");
            }

            const newUser = new User({
                ...args
            });
            return await newUser.save();
        },

        loginUser: async (_, { username, password }, context) => {
            const user = await User.findOne({ username });

            if (!user) {
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }

            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { algorithm: 'HS256', expiresIn: jwtExpirySeconds });
            context.res.cookie("token", token, { 
                httpOnly: true, 
                maxAge: jwtExpirySeconds * 1000,
                //secure: true,
                //sameSite: "none"
                });

            return user;
        },

        logoutUser: async (_, __, context) => {
            context.res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
            return "Logged Out Successfully";
        },

        updateUser: async(_, args, context) => {
            const token = context.req.cookies.token;
            if (!token) {
                throw new Error("Not authenticated");
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(payload._id);

            if (user.id != payload._id) {
                throw new Error("Unauthorized");
            }

            if (args.input.username) user.username = args.input.username;
            if (args.input.password) user.password = args.input.password;  
            if (args.input.email) user.email = args.input.email;

            await user.save();

            return user;
        },

        deleteUser: async (_, args, context) => {
            const token = context.req.cookies.token;
            
            if (!token) {
                throw new Error("Not authenticated");
            }

            const payload = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(payload._id);

            if (user.id != payload._id) {
                throw new Error("Unauthorized");
            }

            context.res.clearCookie("token");
            await User.findByIdAndDelete(args.id);

            return "User deleted successfully";
        }
    }
}