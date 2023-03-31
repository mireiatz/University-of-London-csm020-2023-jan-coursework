//likes schema (source: [1])
const mongoose = require('mongoose')

const LikesSchema = mongoose.Schema({
    like_postId:{
        type: String,
        required: true
    },
    like_owner:{
        type: String,
        required:true
    },
    like_timestamp:{
        type: Date,
        default: Date.now
    }    
})

module.exports = mongoose.model('likes', LikesSchema)