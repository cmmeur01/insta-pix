const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');


const UserSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    posts: [Post.Schema],
    date: {
      type: Date,
      default: Date.now
    }
  });

module.exports = User = mongoose.model('users', UserSchema);



