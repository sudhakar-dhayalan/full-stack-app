const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://test:uHnITNujS9FKdYmb@cluster0.8zr38r4.mongodb.net/node-angular?retryWrites=true&w=majority')
    .then(() => {
        console.log("Connection successfull!!");
    })
    .catch(e => console.error(e));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONs, PATCH, DELETE'
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Post = require('./models/post');

app.post('/api/posts', (req, res, next) => {
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

app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        console.log(documents)
        res.status(200).json({
            message: 'received posts successfully',
            posts: documents
        })
    })
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: "Post got deleted successfully!!!" });
        })
})
module.exports = app;
// test
// uHnITNujS9FKdYmb
