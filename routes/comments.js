//(source: [1])

//imports and routing 
const express = require('express')
const router = express.Router()

const Comment = require('../models/Comment')
const Post = require('../models/Post')
const verify = require('../verifyToken')//(source: [3])

//POST - create comment
router.post('/:postId', verify, async (req, res) => {
    const commentData = new Comment({
        comment_text: req.body.comment_text,
        comment_owner: req.user.userId,
        comment_postId: req.params.postId,
        comment_timestamp: req.body.comment_timestamp
    })
    try {
        //check post is not their own
        const post = await Post.find({ _id: req.params.postId })
        if (post[0].post_owner != req.user.userId) {
            //save comment
            const saveComment = await commentData.save()
            res.send('Comment saved:\n' + saveComment)
        } else {
            res.send('Cannot comment own posts.')
        }
    } catch (err) {
        res.send({ message: err })
    }
})

//GET - read all comments in a post (source: [1])
router.get('/:postId', verify, async (req, res) => {
    try {
        //find comments 
        const getComments = await Comment.find({ comment_postId: req.params.postId })
        res.send(getComments)
    } catch (err) {
        res.send({ message: err })
    }
})

//export the router (source: [1])
module.exports = router