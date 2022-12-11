const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

// instance method
todoSchema.methods = {
    findActive: () => {
        return mongoose.model('Todo').find({status: 'inactive'})
    },
    findActiveCallback: (cb) => {
        return mongoose.model('Todo').find({status: 'inactive'}, cb)
    }
}

// static method
todoSchema.statics = {
    findByLearn: function() {
        return this.find({title: /learn/i}).select({
            _id: 0,
            __v: 0,
            date: 0
        })
    } 
}
    
// query helper
todoSchema.query = {
    byLanguage: function(language) {
        return this.find({title: new RegExp(language, 'i')}).select({
            _id: 0,
            __v: 0,
            date: 0
        })
    } 
}
  

module.exports = todoSchema;