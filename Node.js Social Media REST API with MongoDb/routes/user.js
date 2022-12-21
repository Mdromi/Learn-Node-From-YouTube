const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");


// update user
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                });
                return res.status(200).json(`Account has been updated`)
            } catch (e) {
                return res.status(500).json(e)
            }
        }
    } else {
        return res.status(403).json(`You can update only your account`)
    }
})

// delete user
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json(`Account has been deleted`)
        } catch (e) {
            return res.status(500).json(e)
        }
    } else {
        return res.status(403).json(`You can delete only your account`)
    }
})

// get a user
router.get("/:id", async (req, res) => {
    try {
       const user = await User.findById(req.params.id);
       const {password, updatedAt, createdAt, ...other} = user._doc
        return res.status(200).json(other)
    } catch (e) {
        return res.status(500).json(e)
    }
})

// follow a user
router.put("/follow/:id", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId }});
                await currentUser.updateOne({$push: {flowing: req.params.id }});
                return res.status(200).json(`User been flowed`)
            } else {
                return res.status(403).json(`You are already follow this user`)
            }
        } catch (e) {
            return res.status(500).json(e)
        }
    }  else {
        return res.status(403).json(`You can't follow yourself`)
    }
})
// unfollow a user

router.put("/unfollow/:id", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId }});
                await currentUser.updateOne({$pull: {flowing: req.params.id }});
                return res.status(200).json(`User been unfollowed`)
            } else {
                return res.status(403).json(`You don't follow this user`)
            }
        } catch (e) {
            return res.status(500).json(e)
        }
    }  else {
        return res.status(403).json(`You can't unfollow yourself`)
    }
})

router.get("/", (req, res) => {
    res.send(`user routes`)
})


module.exports = router