// const express = require("express");
// const connection = require("../connection");
// const router = express.Router();
// var auth = require("../services/authentication");

// // Function to execute a query and return a Promise
// const executeQuery = (query) => {
//   return new Promise((resolve, reject) => {
//     connection.query(query, (err, results) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(results);
//     });
//   });
// };

// // Dashboard details endpoint
// router.get("/details", auth.authenticateToken, async (req, res) => {
//   try {
//     const categoryQuery = "SELECT COUNT(id) AS categoryCount FROM category";
//     const productQuery = "SELECT COUNT(id) AS productCount FROM product";
//     const billQuery = "SELECT COUNT(id) AS billCount FROM bill";

//     // Execute all queries in parallel
//     const [categoryResult, productResult, billResult] = await Promise.all([
//       executeQuery(categoryQuery),
//       executeQuery(productQuery),
//       executeQuery(billQuery),
//     ]);

//     // Extract counts from results
//     const data = {
//       category: categoryResult[0].categoryCount,
//       product: productResult[0].productCount,
//       bill: billResult[0].billCount,
//     };

//     // Send response
//     return res.status(200).json(data);
//   } catch (error) {
//     // Handle errors
//     return res.status(500).json({ message: "Error fetching data", error });
//   }
// });

// module.exports = router;
const express = require("express");
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");

router.get("/details", auth.authenticateToken, (req, res) => {
  let categoryCount, productCount, billCount;

  // Query to get category count
  connection.query("SELECT COUNT(id) AS categoryCount FROM category", (err, results) => {
    if (err) return res.status(500).json(err);
    categoryCount = results[0].categoryCount;

    // Query to get product count
    connection.query("SELECT COUNT(id) AS productCount FROM product", (err, results) => {
      if (err) return res.status(500).json(err);
      productCount = results[0].productCount;

      // Query to get bill count
      connection.query("SELECT COUNT(id) AS billCount FROM bill", (err, results) => {
        if (err) return res.status(500).json(err);
        billCount = results[0].billCount;

        // Return the dashboard data
        res.status(200).json({
          category: categoryCount,
          product: productCount,
          bill: billCount,
        });
      });
    });
  });
});

module.exports = router;
