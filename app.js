const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost/blog');

// Define a schema for the posts
const postSchema = new mongoose.Schema({
  username: String,  
  title: String,
  content: String, 
});

// Create a model for the posts
const Post = mongoose.model('Post', postSchema);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use the body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the homepage
app.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render('index', {
    title: 'Blog',
    posts,
  });
});

// Define a route for creating a new post
app.post('/create-post', async (req, res) => {
  const { username, title, content } = req.body;
  const newPost = new Post({ username, title, content });
  await newPost.save();
  res.redirect('/');
});


// Define a route for deleting a post
app.post('/delete-post', async (req, res) => {
    const id = req.body.id;
    await Post.findByIdAndDelete(id);
    res.redirect("/")
  });

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});