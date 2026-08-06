const Cart = require("../models/Cart");

exports.addCart = async (req, res) => {

    const cart = await Cart.create(req.body);

    res.json(cart);

};

exports.getCart = async (req, res) => {

    const cart = await Cart.find();

    res.json(cart);

};