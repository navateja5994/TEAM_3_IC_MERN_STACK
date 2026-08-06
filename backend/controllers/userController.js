const User = require("../models/User");

exports.register = async (req, res) => {

    const user = await User.create(req.body);

    res.json(user);

};

exports.login = (req, res) => {

    res.json({

        message: "Login Successful"

    });

};