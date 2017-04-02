'use strict';

const TelegramBot = require('node-telegram-bot-api');
const TCLRandomPost = require('./the-coding-love-random-post.js');
const express = require('express');
const bodyParser = require('body-parser');

class TheBot {
  constructor(telegramToken, tumblrApiKey) {
    this.api = new TCLRandomPost(tumblrApiKey);
    this.bot = new TelegramBot(telegramToken);
    this.bot.setWebHook('https://thecodingloverandombot.appspot.com/');

    const app = express();

    app.use(bodyParser.json());

    app.post(`/`, (req, res) => {
      this.bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    app.get('/', (req, res) => {
      res.status(200).send('It works!');
    });

    // Start Express Server
    const server = app.listen(process.env.PORT || 8080, () => {
      const port = server.address().port;
      console.log(`Express server is listening on ${port}`);
    });

    this.bot.onText(/\/love/, msg => {
      console.log('Received /love');
      console.log(`From: ${JSON.stringify(msg)}`);

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
