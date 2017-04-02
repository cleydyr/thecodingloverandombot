'use strict';

const bot = new (require('./lib/the-webhook-bot.js'))(process.env.TELEGRAM_TOKEN, process.env.TUMBLR_API_KEY);

console.log('App started');
