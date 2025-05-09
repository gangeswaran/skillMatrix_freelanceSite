const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["freelancer", "buyer"],
    required: true,
  },
  username: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  portfolio: [
    {
      title: { type: String },
      projectDescription: { type: String },
      portfolioLinks: [{ type: String }],
    },
  ],
  // New fields for ratings and reviews
  ratings: {
    type: [Number], // Array to store all ratings given to freelancer
    default: [],
  },
  reviews: [
    {
      buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Buyer giving the review
      reviewText: { type: String, required: true }, // Review text
      rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
      createdAt: { type: Date, default: Date.now }, // When the review was given
    },
  ],
  credits: { type: Number, default: 0 },
  price: {
    type: Number, // Freelancer's price for their service (could be hourly or gig-based)
    required: true,
    default: 0,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
