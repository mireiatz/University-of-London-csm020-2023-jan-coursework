//users schema (source: [3])
const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    user_name:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    user_email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    user_password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    user_timestamp:{
        type: Date,
        default: Date.now
    }   
    
})

module.exports = mongoose.model('users', usersSchema)