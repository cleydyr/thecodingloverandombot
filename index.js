const codingLove = require('thecodinglove_parser/parser.js');
const decode = require('decode-html');
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

bot.onText(/\/love/, msg => {
  console.log('Received /love');
  
  codingLove.getRandomEntry((error, entry) => {
    if (!!error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, "Sorry. We have faced an internal error. Please try again.");
    } else {
      console.log(entry);
      if (entry.image.endsWith(".gif")) {
        bot.sendDocument(
          msg.chat.id,
          entry.image,
          {
            caption: decode(decode(entry.title))
          });
      }
      else {
        bot.sendPhoto(
          msg.chat.id,
          entry.image,
          {
            caption: decode(decode(entry.title))
          });
      }
    }
  });
});

console.log('App started');
