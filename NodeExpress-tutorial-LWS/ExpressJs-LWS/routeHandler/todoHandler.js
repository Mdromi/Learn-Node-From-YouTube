const router = require('express').Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');

const checkLogin = require('../middleware/checkLogin')

const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// Get TODO By Language
router.get('/language', async (req, res) => {
    try{
        const data = await Todo.find().byLanguage('Alogorithm');

        res.status(200).json({
            message: `Find all Learn List`,
            data
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Get active TODO
router.get('/learn', async (req, res) => {
    try{
        const data = await Todo.findByLearn();

        res.status(200).json({
            message: `Find all Learn List`,
            data
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Get active TODO
router.get('/active', async (req, res) => {
    try{
        const todo = new Todo();
        const data = await todo.findActive();

        res.status(200).json({
            message: `Find all active TODO`,
            data
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Get all TODO
router.get('/', checkLogin, async (req, res) => {
    try{
        let result = await Todo.find({status: 'active'})
        .populate("user", "name username -_id")
        .select({
            _id: 0,
            __v: 0,
            date: 0
        }).limit(2)

        res.status(200).json({
            message: `Todo was find successfully`,
            result
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Get a TODO by id
router.get('/:id', checkLogin, async (req, res) => {
    try{
        let result = await Todo.findById(req.params.id).select({
            _id: 0,
            __v: 0,
            date: 0
        })

        res.status(200).json({
            message: `Todo was find successfully`,
            result
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Post TODO
router.post('/', checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId
    });
    try {
        const todo = await newTodo.save();
        await User.updateOne({
            _id: req.userId
        }, {
            $push: {
                todos: todo._id
            }
        });

        res.status(200).json({
            message: `Todo was inserted successfully`,
            todo
        })
    } catch (e) {
        res.status(500).json({
            error: `There was a server side error!`
        });
    }
});

// Post multiple TODO
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if(err) {
            res.status(500).json({
                error: `There was a server side error!`
            });
        } else {
            res.status(200).json({
                message: `Todo was inserted successfully`
            })
        }
    })
});

// Put Todo
router.put('/:id', async (req, res) => {
    try{
        await Todo.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    status: "inactive"
                }
            },{
                new: true
            }
        )
        res.status(200).json({
            message: `Todo was inserted successfully`
        })
    }
    catch (e){
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try{
        let result = await Todo.deleteOne({_id: req.params.id})

        res.status(200).json({
            message: `Todo was delete successfully`,
            result
        })
    } catch(e) {
        res.status(500).json({
            error: `There was a server side error!`,
            e
        });
    }
});

module.exports = router;