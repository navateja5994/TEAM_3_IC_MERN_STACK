const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);

        const order = new Order(req.body);
        await order.save();

        res.json({
            message: "Order saved successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get("/", (req, res) => {
    res.send("Order route working");
});

module.exports = router;