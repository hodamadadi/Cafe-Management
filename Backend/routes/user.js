const express = require("express");
const connection = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

dotenv.config(); // Load environment variables
const saltRounds = 10;
const auth = require("../services/authentication");
const checkRole = require("../services/checkRole");

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Example using Gmail
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Signup route
router.post("/signup", async (req, res) => {
  const { name, contactNumber, email, password } = req.body;

  if (!name || !contactNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = "SELECT email FROM user WHERE email=?";
    const results = await connection.query(query, [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertQuery =
      "INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
    await connection.query(insertQuery, [
      name,
      contactNumber,
      email,
      hashedPassword,
    ]);
    res.status(200).json({ message: "Successfully registered!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Database query error", error: err });
  }
});

//Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query =
      "SELECT email, password, role, status FROM user WHERE email=?";

    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database query error", error: err });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }

      if (user.status === "false") {
        return res.status(401).json({ message: "Wait for admin approval" });
      }

      const response = { email: user.email, role: user.role };
      const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "8h",
      });

      res.status(200).json({ token: accessToken });
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const query = "SELECT email, password, role, status FROM user WHERE email=?";

//     // Use the callback version or promisified version of connection.query
//     connection.query(query, [email], async (err, results) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ message: "Database query error", error: err.message });
//       }

//       if (results.length === 0) {
//         return res.status(401).json({ message: "Incorrect username or password" });
//       }

//       const user = results[0];

//       // Check if password matches
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Incorrect username or password" });
//       }

//       // Check if account is approved
//       if (user.status === "false") {
//         return res.status(401).json({ message: "Wait for admin approval" });
//       }

//       // Prepare response payload
//       const response = { email: user.email, role: user.role };
//       const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "8h" });

//       res.status(200).json({ token: accessToken });
//     });
//   } catch (err) {
//     console.error("Error in login:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// Forgot Password route
// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query =
      "SELECT email, password, role, status FROM user WHERE email=?";

    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Database query error", error: err.message });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }

      const user = results[0];

      // Compare plain text password
      if (password !== user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      }

      // Check if account is approved
      if (user.status === "false") {
        return res.status(401).json({ message: "Wait for admin approval" });
      }

      // Prepare response payload
      const response = { email: user.email, role: user.role };
      const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "8h",
      });

      res.status(200).json({ token: accessToken });
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Users route
router.get(
  "/get",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    try {
      const query =
        "SELECT id, name, email, contactNumber, status FROM user WHERE role='user'";
      const results = await connection.query(query);
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: "Database query error", error: err });
    }
  }
);

// Update User Status route
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res) => {
    const { status, id } = req.body;

    if (!status || !id) {
      return res.status(400).json({ message: "Status and ID are required" });
    }

    try {
      const query = "UPDATE user SET status=? WHERE id=?";
      const results = await connection.query(query, [status, id]);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User ID does not exist" });
      }
      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Database query error", error: err });
    }
  }
);

// Check Token route
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Change Password route
router.post("/changePassword", auth.authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = res.locals.email;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old and new passwords are required" });
  }

  try {
    const query = "SELECT * FROM user WHERE email=?";
    const results = await connection.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, results[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password!" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const updateQuery = "UPDATE user SET password=? WHERE email=?";
    await connection.query(updateQuery, [hashedNewPassword, email]);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password", error: err });
  }
});

module.exports = router;
