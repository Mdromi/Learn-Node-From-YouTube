const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const upload = require('./middleware/fileUploadMiddleware');
const {uploadController} = require('./controllers/uploadControllers');

const todoHandler = require('./routeHandler/todoHandler')
const userHandler = require('./routeHandler/userHandler')
const checkLogin = require('./middleware/checkLogin')

const app = express()
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const filePath = path.resolve(__dirname, 'public/index.html');
const fileCSSPath = path.resolve(__dirname, 'public/style.css');

// File UPLOAD ROUTE
app.get("/file-upload", (req, res) => {
    res.sendFile(filePath);
});
app.post("/file-upload", checkLogin, upload.single('up-file'), uploadController);

// Mongoose CURD Application
app.use('/todo', todoHandler);
app.use('/user', userHandler)

app.get('/', (req, res) => {
    res.send('This is home page')
});


// 404 errors handler
app.use((req, res, next) => {
    next('Requested url was not found')
})

// server errors handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        next('There was an problem')
    } else {
        if(err.message) {
            res.status(500).send(err.message)
        } else {
            res.send('There was an error')
        }
    }
});


// Database connection with mongoose 
const MONGODB_URI = `mongodb://localhost:27017/todos`;
const PORT = process.env.PORT || 4000;
mongoose.set('strictQuery', true);
mongoose
    .connect(MONGODB_URI, { 
        useNewUrlParser: true
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