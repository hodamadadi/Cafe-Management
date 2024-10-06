// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// // const { response } = require("..");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split[" "][1];
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
//     if (err) return res.sendStatus(403);
//     res.locals = response;
//     next();
//   });
// }
// module.exports = { authenticateToken: this.authenticateToken };


// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Use parentheses for split
//   if (token == null) return res.sendStatus(401); // If no token, respond with 401
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // Match environment variable name
//     if (err) return res.sendStatus(403); // If token is invalid, respond with 403
//     res.locals.user = user; // Store user in res.locals for later use
//     next(); // Proceed to the next middleware or route handler
//   });
// }

// module.exports = { authenticateToken }; // Correct export
require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  // Extract the token from the header
  const token = authHeader && authHeader.split(' ')[1];
  
  // If there's no token, respond with 401 Unauthorized
  if (token == null) return res.sendStatus(401);
  
  // Verify the token using the secret
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // If token is invalid, respond with 403 Forbidden
    if (err) return res.sendStatus(403);
    
    // Store the user info in res.locals for later use
    res.locals.user = user;
    
    // Continue to the next middleware or route handler
    next();
  });
}

module.exports = { authenticateToken };
