const bot = require("../bot");
const {
  adminStartText,
  showLastProduct,
  showClients,
  showAdminKeyboards,
  addedCategory,
  editCategory,
  deleteProduct,
  captionText,
  editProductText,
} = require("../../other/text.service.js");
const { adminKeyboard, adminProductsKeyboard } = require("../keys/keyboard.js");
const serverConfig = require("../../config.js");
const ProductsModel = require("../../model/Products.model.js");
const {
  price,
  weightValidation,
  kcalValidation,
  categoryValidation,
} = require("../../utils/validation/product.validation.js");
const ClientModel = require("../../model/Client.model.js");
const { cloudinary } = require("../../lib/jinja/cloudinary.js");
const {
  checkProducts,
  buyProduct,
  isHalal,
  adminProductKeyboard,
  addedCt,
  deletePr,
  editProductKeyboard,
} = require("../keys/inline.js");
const CategoryModel = require("../../model/Category.model.js");
const { BOT, PRODUCT_REG_STATES, CATEGORY_REG_STATES } = serverConfig;

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
