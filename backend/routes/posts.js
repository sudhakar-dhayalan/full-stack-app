const express = require('express');

const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

router.post('', multer(storage).single('image'), (req, res, next) => {
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
