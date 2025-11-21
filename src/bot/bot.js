const TelegramBot = require("node-telegram-bot-api");
const serverConfig = require("../config");
const {BOT} = serverConfig;

const bot = new TelegramBot(BOT.BOT_TOKEN, {polling: true});

module.exports = bot;

require("./message");
require("./query");