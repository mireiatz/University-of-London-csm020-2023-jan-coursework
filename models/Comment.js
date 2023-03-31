//comments schema (source: [1])
const mongoose = require('mongoose')

const CommentsSchema = mongoose.Schema({
    comment_text:{
        type: String,
        required: true
    },
    comment_postId:{
        type: String,
        required: true
    },
    comment_owner:{
        type: String,
        required:true
    },
    comment_timestamp:{
        type: Date,
        default: Date.now
    }    
})

module.exports = mongoose.model('comments', CommentsSchema)