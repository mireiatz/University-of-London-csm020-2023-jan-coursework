//(source: [1])

//imports and routing 
const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const Like = require('../models/Like')
const verify = require('../verifyToken')//(source: [3])

//POST - like a post
router.post('/:postId', verify, async (req, res) => {
    const likeData = new Like({
        like_owner: req.user.userId,
        like_postId: req.params.postId,
        like_timestamp: req.body.like_timestamp
    })
    try {
        //find post
        const post = await Post.findById(req.params.postId)
        if (post != '') {
            //check if user is the owner
            if (post.post_owner != req.user.userId) {
                //calculate new amount of likes in post
                const oneMoreLike = post.post_likes + 1
                const oneLessLike = post.post_likes - 1

                //check if user has liked the post
                const getLikes = await Like.find({ like_owner: req.user.userId, like_postId: req.params.postId })
                if (getLikes != '') {
                    //user has liked the post - unlike
                    //remove like from post
                    const post = await Post.updateOne(
                        { _id: req.params.postId },
                        {
                            $set: {
                                post_likes: oneLessLike,
                            }
                        })

                    //delete like
                    const deleteLike = await Like.deleteOne(
                        { like_owner: req.user.userId, like_postId: req.params.postId }
                    )
                    res.send('Post unliked.')
                } else {
                    //user has not liked the post - like
                    //add like to post
                    const post = await Post.updateOne(
                        { _id: req.params.postId },
                        {
                            $set: {
                                post_likes: oneMoreLike,
                            }
                        })

                    //save like
                    const saveLike = await likeData.save()
                    res.send('Post liked.')
                }
            } else {
                res.send('Cannot like your own posts.')
            }

        } else {
            res.send('Post cannot be found.')
        }
    } catch (err) {
        res.send({ message: err })
    }
})

//GET - read all likes (source: [1])
router.get('/:postId', verify, async (req, res) => {
    try {
        //find likes
        const likes = await Like.find({like_postId: req.params.postId})
        res.send('Likes on this post: ' + likes.length + '\n' + likes)
    } catch (err) {
        res.send({ message: err })
    }
})

//export the router (source: [1])
module.exports = router