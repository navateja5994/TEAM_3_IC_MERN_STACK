const express = require("express");

const router = express.Router();

const {

    addCart,

    getCart

} = require("../controllers/cartController");

router.post("/", addCart);

router.get("/", getCart);

module.exports = router;