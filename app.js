const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://test:test123@crash-course.xtopq.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected to db");
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });


// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('-----new request made:-----');
    console.log('host', req.hostname);
    console.log('path', req.path);
    console.log('method', req.method);
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create new blog' });
})

// redirect
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});


// 404 page
app.use((req, res) => {
    // res.status(404).sendFile('./views/404.html', { root: __dirname })
    res.status(404).render('404', { title: '404' });
});
