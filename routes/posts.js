//(source: [1])

//imports and routing 
const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const verify = require('../verifyToken')//(source: [3])

//POST - create post
router.post('/', verify, async (req, res) => {
    const postData = new Post({
        post_title: req.body.post_title,
        post_content: req.body.post_content,
        post_owner: req.user.userId,
        post_timestamp: req.body.post_timestamp
    })
    try {
        //save post
        const savePost = await postData.save()
        res.send('Post saved:\n' + savePost)
    } catch (err) {
        res.send({ message: err })
    }
})

//GET - read all posts 
router.get('/', verify, async (req, res) => {
    try {
        //find posts
        const getPosts = await Post.find().sort({post_likes: 'desc', post_timestamp: 'desc'})//sorted by popularity and then descending chronological order (source: [4])
        res.send(getPosts)
    } catch (err) {
        res.send({ message: err })
    }
})

//GET - read posts by id 
router.get('/:postId', verify, async (req, res) => {
    try {
        //find posts
        const getPostById = await Post.findById(req.params.postId)
        res.send(getPostById)
    } catch (err) {
        res.send({ message: err })
    }
})

//PATCH - update post by id 
router.patch('/:postId', verify, async (req, res) => {
    try {
        //check if user is the owner of the post
        const post = await Post.find({ _id: req.params.postId })
        if (post[0].post_owner == req.user.userId) {
            //update post data
            const updatePostById = await Post.updateOne(
                { _id: req.params.postId },
                {
                    $set: {
                        post_title: req.body.post_title,
                        post_content: req.body.post_content,
                    }
                })
            res.send(updatePostById)
        } else {
            res.send('Can only update own posts.')
        }
    } catch (err) {
        res.send({ message: err })
    }
})

//DELETE - delete post by id 
router.delete('/:postId', verify, async (req, res) => {
    try {
        //check if user is the owner of the post
        const post = await Post.find({ _id: req.params.postId })
        if (post[0].post_owner == req.user.userId) {
            //delete post
            const deletePostById = await Post.deleteOne(
                { _id: req.params.postId }
            )
            res.send(deletePostById)
        } else {
            res.send('Can only delete own posts.')
        }
    } catch (err) {
        res.send({ message: err })
    }
})

//export the router 
module.exports = router