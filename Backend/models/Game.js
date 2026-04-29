import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: {type: String},
  background_image: { type: String },
  rating: { type: Number },
  released: { type: String },
  platforms: [{ type: String }], 
  genres: [{ type: String }],      
  myPlatforms: [{ type: String }],
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Game = mongoose.model('Game', gameSchema);