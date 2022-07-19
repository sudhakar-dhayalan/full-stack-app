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
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const postsRoute = require('./routes/posts');

app.use('/api/posts', postsRoute)

module.exports = app;
// test
// uHnITNujS9FKdYmb
