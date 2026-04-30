import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  rawgId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: {type: String},
  background_image: { type: String },
  rating: { type: Number },
  myRating: {type: Number},
  released: { type: String },
  platforms: [{ type: String }], 
  genres: [{ type: String }],      
  myPlatforms: [{ type: String }],
  review: { type: String },
  status: {type: String, enum: ["Playing", "Completed", "Backlog", "Re-playing"], default: "Backlog"},
  Owned: {type: Boolean},
  createdAt: { type: Date, default: Date.now },
});

export const Game = mongoose.model('Game', gameSchema);