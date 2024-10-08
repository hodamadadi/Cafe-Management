const express = require("express");
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/add", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  let product = req.body;
  query =
    "Insert into product (name , categoryId, description, price, status) values(?,?,?,?, 'true') ";
  connection.query(
    query,
    [product.name, product.categoryId, product.description, product.price],
    (err, results) => {
      if (!err) {
        return res
          .status(200)
          .json({ message: "Products Added Successfully!" });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.get("/get", auth.authenticateToken, (req, res, next) => {
  var query =
    "select p.id,p.name,p.description,p.price,p.status, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res, next) => {
  var query =
    "select id, name from product where categoryId= ? add status= 'true' ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/getById/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query = "select id , name , description, price from product where id = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;
    var query = "Update product set name=? , categoryId=?, price=? where id=?";
    connection.query(
      query,
      [
        product.name,
        product.categoryId,
        product.description,
        product.price,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "Product id does not found!" });
          }
          return res
            .status(200)
            .json({ message: " Product Update Successfully!" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;
    var query = "Delete from product set where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res
            .status(404)
            .json({ message: "Product id does not found!" });
        }
        return res
          .status(200)
          .json({ message: " Product Delete Successfully!" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let product = req.body;
    var query = "Update product set Status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res
            .status(404)
            .json({ message: "Product id does not found!" });
        }
        return res
          .status(200)
          .json({ message: " Product  Status Updated Successfully!" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
module.exports = router;
