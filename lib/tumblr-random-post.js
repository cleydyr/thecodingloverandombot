'use strict';

const tumblr = require('tumblr.js');

class TumblrRandomPost {
  constructor(consumerKey) {
    this.consumerKey = consumerKey;
    this.client = tumblr.createClient(
      {
        consumer_key: this.consumerKey
      }
    );
  }

  getRandomPost(blogName, callback) {
    this.client.blogInfo(blogName, (err, resp) => {
      if (resp) {
        let total_posts = resp.blog.total_posts;
        let random = getRandomInt(0, resp.blog.total_posts);
        this.client.blogPosts(blogName, {offset: random, limit: 1}, (err, resp) => {
          callback(err, resp);
        });
      }
      else {
        callback(err, resp);
      }
    });
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = TumblrRandomPost;
