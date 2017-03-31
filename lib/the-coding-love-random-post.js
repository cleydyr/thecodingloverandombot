'use strict';

const TumblrRandomPost = require('./tumblr-random-post.js');

class TCLRandomPost {
  constructor(apiKey) {
    this.tumblrRandom = new TumblrRandomPost(apiKey);
  }

  getRandomPost(callback) {
    this.tumblrRandom.getOne('thecodinglove.com', (err, resp) => {
      if (resp) {
        let post = resp.posts[0];
        if (post) {
          callback(err, post);
        }
      }
      else {
        callback(err, post);
      }
    });
  }
}

module.exports = TCLRandomPost;