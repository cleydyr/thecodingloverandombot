'use strict';

const bot = new (require('./lib/the-webhook-bot.js'))(process.env.TELEGRAM_TOKEN);

console.log('App started');
