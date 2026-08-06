const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    payment: String
});

module.exports = mongoose.model("Order", orderSchema);