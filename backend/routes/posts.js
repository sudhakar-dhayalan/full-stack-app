const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(addedPost => {
        console.log('added post succss')
        console.log(addedPost)
        res.status(201).json({
            message: 'Post added successfully!!!',
            postId: addedPost._id
        })
    });
});

router.put('/:id', (req, res, next) => {
    // const post = {
    //     _id: req.params.id,
    //     title: req.body.title,
    //     content: req.body.content
    // }
    Post.updateOne(
        { _id: req.params.id },
        {
            $set: {
                title: req.body.title,
                content: req.body.content
            }
        }
    ).then(result => {
        res.status(200).json({
            message: 'Update successful!!!'
        });
    });
});

router.get('', (req, res, next) => {
    Post.find().then(documents => {
        console.log(documents)
        res.status(200).json({
            message: 'received posts successfully',
            posts: documents
        })
    })
});

router.get('/:id', (req, res, next) => {
    Post.findOne({ _id: req.params.id }).then(result => {
        console.log(res);
        res.status(200).json({
            _id: result._id,
            title: result.title,
            content: result.content
        });
    })
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: "Post got deleted successfully!!!" });
        })
})

module.exports = router;
