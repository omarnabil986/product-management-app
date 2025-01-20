const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");

const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const errorHandler = require("./middlewares/errorMiddleware");

const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post("/api/auth/register", authController.registerUser);
app.post("/api/auth/login", authController.loginUser);
app.use("/api", productRoutes);

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongo();
