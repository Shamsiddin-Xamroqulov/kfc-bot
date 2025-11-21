const { BOT, PRODUCT_REG_STATES } = require("../../config");
const CategoryModel = require("../../model/Category.model");
const ProductsModel = require("../../model/Products.model");
const { productsMenu, newProductsText } = require("../../other/text.service");
const bot = require("../bot");
const { fastFoodMenu, categoryMenu, buyProduct } = require("../keys/inline");

const keyboardHelper = async (chatId) => {
  const category = await CategoryModel.find({}).limit(5);
  return bot.sendMessage(chatId, productsMenu(), {
    parse_mode: "Markdown",
    reply_markup: fastFoodMenu(category),
  });
};

const handleShowAddedProducts = async () => {
  const categories = await CategoryModel.find({});
  await ProductsModel.create({
    step: PRODUCT_REG_STATES.CHOOSING_CATEGORY,
    chatId: BOT.ADMIN_ID,
  });
  bot.sendMessage(BOT.ADMIN_ID, newProductsText(), {
    parse_mode: "Markdown",
    reply_markup: categoryMenu(categories),
  });
};

const userProductCounts = new Map();

const createUpdatedCaption = (oldCaption, newCount, newPrice, unitPrice) => {
  const safeNewPrice = isNaN(newPrice) ? 0 : newPrice;
  const safeUnitPrice = isNaN(unitPrice) ? 0 : unitPrice;

  const formattedPrice = safeNewPrice.toLocaleString("uz-UZ");
  const formattedUnitPrice = safeUnitPrice.toLocaleString("uz-UZ");

  const newPriceText = `💰 Narxi: ${formattedPrice} UZS (${newCount} x ${formattedUnitPrice} UZS)`;

  const fullPriceLineRegex = /💰 Narxi:.*(\(\d+ x [\d\s,]+ UZS\))*/m;

  if (oldCaption && oldCaption.match(fullPriceLineRegex)) {
    return oldCaption.replace(fullPriceLineRegex, newPriceText);
  }

  return oldCaption;
};

const handleCount = async (queryData, query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (
    queryData.startsWith("count_plus") ||
    queryData.startsWith("count_minus")
  ) {
    const parts = queryData.split("_");
    const action = parts[1];
    const productId = parts[2];

    const key = `${chatId}_${productId}`;
    let currentCount = userProductCounts.get(key) || 1;

    if (action === "plus") {
      currentCount++;
    } else if (action === "minus" && currentCount > 1) {
      currentCount--;
    } else if (action === "minus" && currentCount === 1) {
      await bot.answerCallbackQuery(query.id, {
        text: "Miqdor 1 dan kam bo'lishi mumkin emas.",
      });
      return;
    }
    userProductCounts.set(key, currentCount);

    const product = await ProductsModel.findById(productId);
    if (!product) {
      await bot.answerCallbackQuery(query.id, {
        text: "Mahsulot topilmadi.",
        show_alert: true,
      });
      return;
    }

    let rawPrice = product.price;

    if (typeof rawPrice === "string") {
      rawPrice = rawPrice.replace(/\s/g, "");
    }

    const unitPrice = Number(rawPrice);

    if (isNaN(unitPrice)) {
      await bot.answerCallbackQuery(query.id, {
        text: "Mahsulot narxi noto'g'ri formatda (DB xatosi).",
        show_alert: true,
      });
      return;
    }

    const newPrice = currentCount * unitPrice;
    const newKeyboard = buyProduct(productId, currentCount);
    const newCaption = createUpdatedCaption(
      query.message.caption,
      currentCount,
      newPrice,
      unitPrice
    );

    await bot
      .editMessageReplyMarkup(newKeyboard, {
        chat_id: chatId,
        message_id: messageId,
      })
      .catch((err) => {
        if (err.message && err.message.includes("message is not modified")) {
          return;
        }
        console.error("Edit message reply markup failed:", err.message);
      });

    await bot
      .editMessageCaption(newCaption, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "Markdown",
        reply_markup: newKeyboard,
      })
      .catch((err) => {
        if (err.message && err.message.includes("message is not modified")) {
          return;
        }
        console.error("Edit message caption failed:", err.message);
      });

    await bot.answerCallbackQuery(query.id);
    return;
  }
};

const handleNext = async (chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  await keyboardHelper(chatId);
};

module.exports = { keyboardHelper, handleShowAddedProducts, handleCount, handleNext };
