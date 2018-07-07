'use strict';

const TumblrRandomPost = require('./tumblr-random-post.js');

class DORRandomPost {
  constructor(apiKey) {
    this.tumblrRandom = new TumblrRandomPost(apiKey);
  }

  getRandomPost(callback) {
    this.tumblrRandom.getRandomPost('devopsreactions.tumblr.com', (err, resp) => {
      if (resp) {
        let post = resp.posts[0];
        if (post) {
          callback(err, post);
        }
      }
      else {
        callback(err, null);
      }
    });
  }
}

module.exports = TCLRandomPost;
