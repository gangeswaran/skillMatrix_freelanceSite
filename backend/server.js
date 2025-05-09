// File: server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Message = require('./models/Message');
const cors = require("cors");
const jwt = require("jsonwebtoken");

const verifyToken = require("./middleware/verifytoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const dbURI = "mongodb+srv://gangeswaran375:123@free.5tbsiw4.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Registration route
app.post("/register", async (req, res) => {
  const { name, email, password, userType, skills, portfolio } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
      skills,
      portfolio,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log(user.userType);
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      "sdfgjnfkfnv", // Secret key (use an environment variable)
      { expiresIn: "1h" } // Token expiration (e.g., 1 hour)
    );
    const type =user.userType
    const id = user._id
    res.status(200).json({ message: "Login successful", token,type,id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route to get freelancer's info
app.get("/freelancer", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/search", async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).send("Skill query parameter is required.");
  }

  try {
    // Find users whose skills array contains the given skill (case-insensitive search)
    const freelancers = await User.find({
      userType: "freelancer",  // Only freelancers
      skills: { $in: [new RegExp(skill, "i")] }, // Case-insensitive search for the skill
    });

    if (freelancers.length === 0) {
      return res.status(404).send("No freelancers found with this skill.");
    }

    res.json(freelancers);
  } catch (error) {
    console.error("Error searching freelancers by skill:", error);
    res.status(500).send("Server error");
  }
});
app.get('/freelancer/:id', async (req, res) => {
  const freelancerId = req.params.id;

  try {
    // Fetch freelancer details from the database
    const freelancer = await User.findById(freelancerId);

    // Check if freelancer exists
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Return freelancer data as a response
    res.json(freelancer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not fetch freelancer details' });
  }
});


const Conversation = require("./models/conversation");
const { getReceiverSocketId, io } = require("./socket/socket");
const protectRoute = require("./middleware/protectRoute");

app.post("/send/:id",protectRoute, async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!senderId) {
      return res.status(401).json({ error: "Unauthorized access. SenderId missing." });
    }
    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      freelancerId: receiverId, // ✅ Add this line
      message,
    });
    

    const savedMessage = await newMessage.save();
    
    // Push message ID into conversation after saving the message
    conversation.messages.push(savedMessage._id);
    const savedConversation = await conversation.save();

    if (!savedConversation || !savedMessage) {
      throw new Error("Error saving conversation or message.");
    }

    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    const senderSocketId = getReceiverSocketId(senderId.toString());

    // Log receiver socket ID for debugging
    console.log("Receiver Socket ID:", receiverSocketId);
    
    if (receiverSocketId) {
      io().to(receiverSocketId).emit("receiveMessage", savedMessage);
    }
    if (senderSocketId) {
      io().to(senderSocketId).emit("receiveMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});


app.get('/messages/:freelancerId', async (req, res) => {
  const { freelancerId } = req.params;

  try {
    const messages = await Message.find()
      console.log(messages);
      

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});


app.post("/:id",protectRoute, async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});


app.post("/rate/:freelancerId", async (req, res) => {
  try {
    // Assuming the buyer is logged in and their ID is stored in req.user
    const { rating, review,buyerId } = req.body;
    console.log(rating, review,buyerId);
    
    if (!rating || !review) {
      return res.status(400).json({ message: "Rating and review text are required." });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Find the freelancer (user)
    const freelancer = await User.findById(req.params.freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found." });
    }

    // Check if the buyer has already reviewed this freelancer
    const existingReview = freelancer.reviews.find(
      (review) => review.buyerId.toString() === buyerId.toString()
    );
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this freelancer." });
    }

    // Create the new review object
    const newReview = {
      buyerId: buyerId,
      reviewText: review,
      rating: rating,
    };

    // Add the review to the freelancer's profile
    freelancer.reviews.push(newReview);
    freelancer.ratings.push(rating); // Add the rating to the ratings array

    // Recalculate the average rating
    const totalRatings = freelancer.ratings.reduce((acc, rating) => acc + rating, 0);
    const averageRating = totalRatings / freelancer.ratings.length;

    // Update the freelancer's average rating
    freelancer.averageRating = averageRating;

    // Save the updated freelancer profile
    await freelancer.save();

    res.status(200).json({
      message: "Review submitted successfully.",
      averageRating: freelancer.averageRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.get("/reviews/:freelancerId", async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.freelancerId);

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found." });
    }

    res.status(200).json({
      reviews: freelancer.reviews || [],
      averageRating: freelancer.averageRating || 0,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
});
const PurchaseRequest = require("./models/gigs")
app.post("/buy/:freelancerId", async (req, res) => {
  try {
    const { buyerId } = req.body;
    const freelancerId = req.params.freelancerId;

    // Validate input
    if (!buyerId) {
      return res.status(400).json({ message: "Buyer ID is required." });
    }

    // Check if the purchase request already exists
    const existingRequest = await PurchaseRequest.findOne({
      buyerId,
      freelancerId,
      status: 'pending', // To avoid duplicate requests
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Purchase request already pending." });
    }

    // Create the new purchase request
    const newPurchaseRequest = new PurchaseRequest({
      buyerId,
      freelancerId,
      status: 'pending', // New requests are "pending"
    });

    await newPurchaseRequest.save(); // Save to DB

    // Send response
    res.status(200).json({ message: "Purchase request sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


app.get("/purchase-requests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch purchase requests where the user is either a buyer or freelancer
    const purchaseRequests = await PurchaseRequest.find({
      $or: [
        { buyerId: userId },
        { freelancerId: userId }
      ]
    }).populate("buyerId freelancerId"); // Optionally populate user data

    res.status(200).json(purchaseRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const offers = await PurchaseRequest.find({
      freelancerId: req.params.freelancerId
    }).populate('buyerId', 'name email');
    res.json(offers);
  } catch (error) {
    console.error("Error fetching freelancer offers:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put("/purchase-requests/:id/accept", async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await PurchaseRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Mark gig completed
    request.status = "accepted";
    await request.save();

    // Give credit to buyer
    const buyer = await User.findById(request.buyerId);
    if (buyer) {
      buyer.credits += 1; // 1 credit per successful gig
      await buyer.save();
    }

    res.status(200).json({ message: "Gig completed and credit awarded" });
  } catch (error) {
    console.error("Error completing gig:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/users/:id/credits", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("credits");
    if (!user) {
      console.log(user);
      
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/freelancer/update", verifyToken, async (req, res) => {
  try {
    const freelancerId = req.user.userId;
    console.log(freelancerId);
    

    const {
      name,
      username,
      bio,
      location,
      skills,
      price,
      portfolio
    } = req.body;

    const updateFields = {
      ...(name && { name }),
      ...(username && { username }),
      ...(bio && { bio }),
      ...(location && { location }),
      ...(Array.isArray(skills) && { skills }),
      ...(typeof price === "number" && { price }),
      ...(Array.isArray(portfolio) && { portfolio })
    };

    const updatedFreelancer = await User.findByIdAndUpdate(
      freelancerId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json(updatedFreelancer);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
