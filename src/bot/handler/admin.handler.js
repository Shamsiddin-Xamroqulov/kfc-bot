const bot = require("../bot");
const {
  adminStartText,
  showClients,
  showAdminKeyboards,
} = require("../../other/text.service.js");
const { adminKeyboard, adminProductsKeyboard } = require("../keys/keyboard.js");
const serverConfig = require("../../config.js");
const ClientModel = require("../../model/Client.model.js");
const { BOT, } = serverConfig;

const adminHandler = async (msg, username) => {
  bot.sendMessage(BOT.ADMIN_ID, adminStartText(msg, username), {
    parse_mode: "HTML",
    reply_markup: adminKeyboard(),
  });
};

const handleAdminShowKeyboards = async () => {
  bot.sendMessage(BOT.ADMIN_ID, showAdminKeyboards(), {
    parse_mode: "Markdown",
    reply_markup: adminProductsKeyboard(),
  });
};

const handleBackKeyboard = async () => {
  bot.sendMessage(BOT.ADMIN_ID, `🏠 Asosiy menyu`, {
    reply_markup: adminKeyboard(),
  });
};

const handleShowClients = async () => {
  const clients = await ClientModel.find();
  bot.sendMessage(BOT.ADMIN_ID, showClients(clients), {
    parse_mode: "Markdown",
  });
};

module.exports = {
  adminHandler,
  handleShowClients,
  handleAdminShowKeyboards,
  handleBackKeyboard,
};
