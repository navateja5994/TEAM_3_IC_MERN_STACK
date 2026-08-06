const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

(async () => {
    try {
        await connectDB();

        const app = express();

        app.use(cors());
        app.use(express.json());

        app.use("/api/products", require("./routes/productRoutes"));
        app.use("/api/users", require("./routes/userRoutes"));
        app.use("/api/cart", require("./routes/cartRoutes"));
        console.log("Loading order route");
        app.use("/api/orders", require("./routes/orderRoutes"));

        app.get("/", (req, res) => {
            res.send("MR Sports Backend Running");
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server Running on ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
})();