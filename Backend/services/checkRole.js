// require("dotenv").config();

// function checkRole(req, res, next) {
//   if (res.locals.role == process.env.USER) res.sendStatus(401);
//   else next();
// }

// module.exports = { checkRole: checkRole };
require("dotenv").config();

function checkRole(requiredRole) {
  return function (req, res, next) {
    // Ensure res.locals.role is set by authenticateToken middleware
    if (!res.locals.user || res.locals.user.role !== requiredRole) {
      return res.sendStatus(403); // Forbidden if role doesn't match
    }
    next(); // Proceed if role matches
  };
}

module.exports = { checkRole };
