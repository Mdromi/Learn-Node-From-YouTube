require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

// routes
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

const app = express()


// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.get("/", (req, res) => {
    res.send(`home routes`)
})




















mongoose.set('strictQuery', true)
const MONGODB_URI = process.env.MONGO_URL;
console.log(process.env.MONGO_URL);
const PORT = process.env.PORT || 4000;
mongoose
    .connect(MONGODB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => { 
        console.log('MongoDB connected...');
        app.listen(PORT, () => {
            console.log(`Server is listing on PORT ${PORT}`);
        })
    })
    .catch(e => {
        return console.log(e);
    })