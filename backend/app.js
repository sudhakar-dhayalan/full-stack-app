const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully!!!'
    })
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'wqhgqt7w2ej',
            title: 'first post',
            content: 'this is the content of the first post'
        },
        {
            id: 'wqhgqt7w2e21',
            title: 'second post',
            content: 'test content, this is the content of the second post'
        },
    ];
    res.status(200).json({
        message: 'received posts successfully',
        posts
    })
});

module.exports = app;
// test
// uHnITNujS9FKdYmb
