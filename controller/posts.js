const { validationResult } = require('express-validator/check');
const User = require('../models/User');
const Post = require('../models/post');

exports.getAllPsots = async (req, res, next) => {
  const posts = await Post.find().sort({
    date: -1,
  });
  if (!posts) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }

  res.json(posts);
};
exports.getpostById = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }
  res.json(post);
};

exports.addPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });
  const savePost = await newPost.save();
  res.json(savePost);
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }
  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({
      notauthorized: 'User not authorized',
    });
  }
  post.remove().then(() =>
    res.json({
      success: true,
    })
  );
};

exports.likePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }
  if (
    post.likes.filter(like => like.user.toString() === req.user.id).length > 0
  ) {
    return res.status(400).json({
      alreadyliked: 'User already liked this post',
    });
  }
  post.likes.unshift({
    user: req.user.id,
  });

  const savePost = await post.save();
  res.json(savePost);
};

exports.unlikePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }
  if (
    post.likes.filter(like => like.user.toString() === req.user.id).length === 0
  ) {
    return res.status(400).json({
      notliked: 'You have not yet liked this post',
    });
  }
  // Get remove index
  const removeIndex = post.likes
    .map(item => item.user.toString())
    .indexOf(req.user.id);

  // Splice out of array
  post.likes.splice(removeIndex, 1);

  // Save
  const savePost = await post.save();
  res.json(savePost);
};

exports.commentPost = async (req, res, next) => {
  const post = Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }
  const newComment = {
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  };

  // Add to comments array
  post.comments.unshift(newComment);
  // Save
  const savePost = post.save();
  res.json(savePost);
};

exports.deleteComment = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({
      postnotfound: 'No post found',
    });
  }

  // Check to see if comment exists
  if (
    post.comments.filter(
      comment => comment._id.toString() === req.params.comment_id
    ).length === 0
  ) {
    return res.status(404).json({
      commentnotexists: 'Comment does not exist',
    });
  }

  const removeIndex = post.comments
    .map(item => item._id.toString())
    .indexOf(req.params.comment_id);

  // Splice comment out of array
  post.comments.splice(removeIndex, 1);

  const savePost = await post.save();
  res.json(savePost);
};
