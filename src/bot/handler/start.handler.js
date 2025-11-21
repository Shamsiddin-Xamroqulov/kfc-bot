const bot = require("../bot");
const serverConfig = require("../../config.js");
const {BOT} = serverConfig;
const {adminHandler} = require("./admin.handler.js");
const {clientHandler} = require("./client.handler.js");

const startHandler = async (msg, chatId) => {
    const username = `fc_77_Bot`;
    if(chatId == BOT.ADMIN_ID) {
        return adminHandler(msg, username);
    }else if(chatId !== BOT.ADMIN_ID) {
        return clientHandler(msg, chatId)
    };
};

module.exports = {startHandler};