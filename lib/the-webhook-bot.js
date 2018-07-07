'use strict';

const Entities = require('html-entities').AllHtmlEntities;
const TelegramBot = require('node-telegram-bot-api');
const getRandomPost = require('./wp-random-post');
const express = require('express');
const bodyParser = require('body-parser');
const entities = new Entities();

class TheBot {
  constructor(telegramToken) {
    this.bot = new TelegramBot(telegramToken);
    this.bot.setWebHook(process.env.WEBHOOK_URL);

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
    const server = app.listen(process.env.PORT || 80, () => {
      const port = server.address().port;
      console.log(`Express server is listening on ${port}`);
    });

    this.bot.onText(/\/love/, msg => {
      this.processMessage(msg);
    });
  }

	processMessage(msg) {
		console.log('Received /love');
		console.log(`From: ${JSON.stringify(msg)}`);
		this.getRandomPost()
			.then(this.processPost(msg))
			.catch(this.handleError(msg));
	}

	handleError(msg) {
		return err => {
			console.error(err);
			this.bot.sendMessage(msg.chat.id, "Sorry. We have faced an internal error. Please try again.");
		};
	}

	getRandomPost() {
		return getRandomPost(process.env.WP_SITE_ENDPOINT);
	}

	processPost(msg) {
		return post => {
			const title = post.title.rendered;

			console.log(`Summary: ${title}`);

			let regex = /src="(.*?)"/;
			let [, imgURL] = regex.exec(post.content.rendered);

			console.log(`Img: ${imgURL}`);

			if (imgURL.endsWith(".gif")) {
				this.sendGif(msg, imgURL, title);
			}
			else {
				this.bot.sendMessage(msg.chat.id, "Sorry. We have faced an internal error. Please try again.");
			}
		};
	}

	sendGif(msg, imgURL, title) {
		this.bot.sendDocument(msg.chat.id, imgURL, {
			caption: entities.decode(title),
		})
			.then(console.log)
			.catch(err => {
				console.log(err);
				this.bot.sendMessage(msg.chat.id, "Sorry. We couldn't find a gif. Please try again.");
			});
	}
}

module.exports = TheBot;
