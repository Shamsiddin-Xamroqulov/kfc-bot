const { BOT, CATEGORY_REG_STATES } = require("../../config");
const CategoryModel = require("../../model/Category.model");
const { addedCategory, editCategory } = require("../../other/text.service");
const { categoryValidation } = require("../../utils/validation/product.validation");
const bot = require("../bot");
const { addedCt } = require("../keys/inline");

const handleAddCategory = async () => {
  await CategoryModel.create({ step: CATEGORY_REG_STATES.NONE });
  bot.sendMessage(BOT.ADMIN_ID, `Kategoriya ismini kiriting 👇`);
};

const handleAddedCategory = async (text, category) => {
  const validation = categoryValidation.validate(text, { abortEarly: false });
  if (validation.error) return bot.sendMessage(BOT.ADMIN_ID, validation.error.message);
  await CategoryModel.findByIdAndUpdate(category._id, {
    name: text,
    step: CATEGORY_REG_STATES.CATEGORY_PENDING,
  });
  bot.sendMessage(BOT.ADMIN_ID, addedCategory(text), {
    parse_mode: "Markdown",
    reply_markup: addedCt(category._id),
  });
};

const handleConfirmCategory = async (queryData, chatId, messageId) => {
  const categoryId = queryData.split("_")[2];
  const category = await CategoryModel.findByIdAndUpdate(categoryId, {
    step: CATEGORY_REG_STATES.CONFIRMATION,
  });
  bot.editMessageText(`✅ Kategoriya muvvafaqiyatli yaratildi`, {
    chat_id: chatId,
    message_id: messageId,
  });
};

const handleCanceledCategory = async (queryData, chatId, messageId) => {
  const categoryId = queryData.split("_")[2];
  await CategoryModel.findByIdAndDelete(categoryId);
  bot.editMessageText(`❌ Kategoriya bekor qilindi`, {
    chat_id: chatId,
    message_id: messageId,
  });
};

const handleEditCategory = async (queryData, chatId, messageId) => {
  const categroyId = queryData.split("_")[2];
  await CategoryModel.findByIdAndUpdate(categroyId, {
    step: CATEGORY_REG_STATES.EDIT_CATEGORY,
  });
  bot.editMessageText(editCategory(), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
  });
};

const handleUpdateCategory = async (text, ct) => {
  const validation = categoryValidation.validate(text, { abortEarly: false });
  if (validation.error) return bot.sendMessage(BOT.ADMIN_ID, validation.error.message);
  await CategoryModel.findByIdAndUpdate(ct._id, {
    name: text,
    step: CATEGORY_REG_STATES.CONFIRMATION,
  });
  bot.sendMessage(BOT.ADMIN_ID, addedCategory(text), {
    parse_mode: "Markdown",
    reply_markup: addedCt(ct._id),
  });
};

module.exports = {
  handleAddCategory,
  handleAddedCategory,
  handleConfirmCategory,
  handleCanceledCategory,
  handleEditCategory,
  handleUpdateCategory
};