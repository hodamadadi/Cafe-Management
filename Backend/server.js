const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./connection"); // Ensure this is configured correctly
const userRoutes = require("./routes/user");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 7000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200", // Replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 204,
};

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Parse JSON bodies

// Use routes
app.use("/user", userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Error starting server:", error.message);
});
