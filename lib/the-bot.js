'use strict';

const TelegramBot = require('node-telegram-bot-api');
const TCLRandomPost = require('./the-coding-love-random-post.js');

class TheBot {
  constructor(telegramToken, tumblrApiKey) {
    this.api = new TCLRandomPost(tumblrApiKey);
    this.bot = new TelegramBot(telegramToken, {polling: true});

    this.bot.onText(/\/love/, msg => {
      console.log('Received /love');
      console.log(`From: {msg}`);

      this.api.getRandomPost((err, post) => {
        if (!!err) {
          console.error(err);
          this.bot.sendMessage(msg.chat.id, "Sorry. We have faced an internal error. Please try again.");
        }
        else {
          console.log(`Summary: ${post.summary}`);
          let regex = /src="(.*?)"/;
          let imgURL = regex.exec(post.body)[1];
          console.log(`Img: ${imgURL}`);
          if (imgURL.endsWith(".gif")) {
            this.bot.sendDocument(
              msg.chat.id,
              imgURL,
              {
                caption: post.summary
              });
          }
          else {
            this.bot.sendMessage(msg.chat.id, "Sorry. We have faced an internal error. Please try again.");
          }
        }
      });
    });
  }
}

module.exports = TheBot;
