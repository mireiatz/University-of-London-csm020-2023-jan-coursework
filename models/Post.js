//posts schema (source: [1])
const mongoose = require('mongoose')

const PostsSchema = mongoose.Schema({
    post_title:{
        type: String,
        required: true
    },
    post_content:{
        type: String,
        required: true
    },
    post_owner:{
        type: String,
        required:true
    },
    post_timestamp:{
        type: Date,
        default: Date.now
    },
    post_likes:{
        type: Number,
        default: 0
    }    
})

module.exports = mongoose.model('posts', PostsSchema)