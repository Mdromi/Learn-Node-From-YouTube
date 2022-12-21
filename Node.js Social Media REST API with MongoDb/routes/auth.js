const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        
        // save user and responded
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json(e)
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // finding user
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json(`User not found`)

        // check valid password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json(`wrong password`)

        // create duplicate user without password
        const userObj = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            followers: user.followers,
            flowing: user.flowing,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            __v: user.__v
        } 

        // NEED UPDATE DELETE PASSWORD
        // responded new user object
        res.status(200).json(user)
    } catch (e) {
        res.status(500).json(e)
    }
})


router.get("/", (req, res) => {
    res.send(`auth routes`)
})


module.exports = router