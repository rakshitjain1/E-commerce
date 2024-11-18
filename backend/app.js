const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")

const errormiddleware = require("./middleware/error")

app.use(express.json());
app.use(cookieParser()) 

// Routes imports

const product = require("./routes/ProductRoute");
const user  = require("./routes/userRoute")
const order = require("./routes/orderRoutes")

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)

// middle ware for error 

app.use(errormiddleware)

module.exports = app