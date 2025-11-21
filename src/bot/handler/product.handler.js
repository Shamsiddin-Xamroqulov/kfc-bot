const { PRODUCT_REG_STATES, BOT } = require("../../config");
const { cloudinary } = require("../../lib/jinja/cloudinary");
const ProductsModel = require("../../model/Products.model");
const {
  showLastProduct,
  captionText,
  deleteProduct,
  editProductText,
} = require("../../other/text.service");
const {
  weightValidation,
  price,
  kcalValidation,
  priceValidation,
} = require("../../utils/validation/product.validation");
const bot = require("../bot");
const {
  isHalal,
  checkProducts,
  adminProductKeyboard,
  buyProduct,
  deletePr,
  editProductKeyboard,
} = require("../keys/inline");

const handleProductName = async (queryData, chatId) => {
  const categoryId = queryData.split("_")[1];
  const product = await ProductsModel.findOne({
    chatId,
    step: PRODUCT_REG_STATES.CHOOSING_CATEGORY,
  });
  if (product) {
    await ProductsModel.findByIdAndUpdate(product._id, {
      category: categoryId,
      step: PRODUCT_REG_STATES.ENTERING_NAME,
    });
    bot.sendMessage(chatId, `Mahsulot nomini kiriting 🔰`);
  }
};

const handleEnteringPrice = async (chatId, text, product) => {
  await ProductsModel.findByIdAndUpdate(product._id, {
    name: text,
    step: PRODUCT_REG_STATES.ENTERING_PRICE,
  });
  bot.sendMessage(chatId, `Narxini kiriting (Masalan: 150000, 150 000)`);
};

const handleEnteringDescription = async (msg, text, product) => {
  const validation = price.validate(text, { abortEarly: false });
  if (validation.error) {
    const message = validation.error.details.map((d) => d.message).join("\n");
    return bot.sendMessage(msg.chat.id, message);
  }
  await ProductsModel.findByIdAndUpdate(product._id, {
    price: text,
    step: PRODUCT_REG_STATES.ENTERING_WEIGHT,
  });
  bot.sendMessage(
    msg.chat.id,
    `Mahsulotning og'irligini kiriting:\n(Misol: 100gr, 1kg, 1 porsiya, 1.5kg, 1l, 500g, 0.5ml, 2dona)`
  );
};

const handleEnteringWeight = async (msg, text, product) => {
  const validation = weightValidation.validate(text, { abortEarly: false });
  if (validation.error) {
    const message = validation.error.details.map((d) => d.message).join("\n");
    return bot.sendMessage(msg.chat.id, message);
  }
  await ProductsModel.findByIdAndUpdate(product._id, {
    weight: text,
    step: PRODUCT_REG_STATES.ENTERING_IS_HALAL,
  });
  bot.sendMessage(
    msg.chat.id,
    "Iltimos, mahsulotingiz halolligini belgilang:\n\n✅ Halol\n❌ Halol emas",
    { reply_markup: isHalal() }
  );
};

const handleCheckHalal = async (queryData, msg) => {
  const chatId = msg.chat.id;
  const check = queryData.split("_")[1];
  await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
  const lastProduct = await ProductsModel.findOne({ chatId }).sort({
    createdAt: -1,
  });
  if (!lastProduct) return;
  if (check === "yes") {
    await ProductsModel.findByIdAndUpdate(lastProduct._id, {
      isHalal: true,
      step: PRODUCT_REG_STATES.ENTERING_CALORIES,
    });
    bot.sendMessage(
      chatId,
      `Mahsulotning kkal ya'ni (Kaloriyasini kiriting):\n(Misol: 250 kcal, 1.5kkal, 3000 KCAL)`
    );
  } else {
    await ProductsModel.findByIdAndDelete(lastProduct._id);
    bot.sendMessage(
      chatId,
      `Bizning botda faqat *Halol* mahsulotlar sotiladi! ❌\n\nMahsulot qo'shish bekor qilindi.`,
      { parse_mode: "Markdown" }
    );
  }
};

const handleEnteringCalories = async (chatId, text) => {
  const validation = kcalValidation.validate(text, { abortEarly: false });
  if (validation.error) {
    const message = validation.error.details.map((d) => d.message).join("\n");
    return bot.sendMessage(chatId, message);
  }
  const lastProduct = await ProductsModel.findOne({ chatId }).sort({
    createdAt: -1,
  });
  if (!lastProduct)
    return bot.sendMessage(chatId, "Xatolik: mahsulot topilmadi ❌");
  await ProductsModel.findByIdAndUpdate(lastProduct._id, {
    calories: text,
    step: PRODUCT_REG_STATES.ENTERING_DESCRIPTION,
  });
  bot.sendMessage(chatId, `Mahsulot haqida ma'lumot kiriting:`);
};

const handleEnteringPhoto = async (msg, text, product) => {
  await ProductsModel.findByIdAndUpdate(product._id, {
    description: text,
    step: PRODUCT_REG_STATES.ENTERING_PHOTO,
  });
  bot.sendMessage(msg.chat.id, `Mahsulot rasmini kiriting (1 dona) 📸`);
};

const handleProductsPending = async (msg, product) => {
  try {
    const file = msg.photo[msg.photo.length - 1];
    const fileLink = await bot.getFileLink(file.file_id);
    const uploadResult = await cloudinary.uploader.upload(fileLink, {
      folder: "kfc",
    });
    const pr = await ProductsModel.findByIdAndUpdate(
      product._id,
      { photo: uploadResult.secure_url, step: PRODUCT_REG_STATES.PENDING },
      { new: true }
    ).populate("category");
    bot.sendPhoto(msg.chat.id, pr.photo, {
      caption: showLastProduct(pr),
      parse_mode: "HTML",
      reply_markup: checkProducts(),
    });
  } catch {
    bot.sendMessage(msg.chat.id, "Rasm yuklashda xatolik yuz berdi ❌");
  }
};

const handleConfirmationProducts = async (chatId, messageId) => {
  const product = await ProductsModel.findOne({ chatId }).sort({
    createdAt: -1,
  });
  if (product && product.step !== PRODUCT_REG_STATES.CONFIRMATION) {
    await bot.deleteMessage(chatId, messageId).catch(() => {});
    await ProductsModel.findByIdAndUpdate(product._id, {
      step: PRODUCT_REG_STATES.CONFIRMATION,
    });
    bot.sendMessage(chatId, `Mahsulot muvaffaqiyatli qo‘shildi ✅`);
  }
};

const handleCanceledProducts = async (chatId, messageId) => {
  const product = await ProductsModel.findOne({ chatId }).sort({
    createdAt: -1,
  });
  if (product) await ProductsModel.findByIdAndDelete(product._id);
  await bot.deleteMessage(chatId, messageId).catch(() => {});
  bot.sendMessage(chatId, `Mahsulot bekor qilindi ❌`);
};

const handleShowProducts = async (msg, chatId, text) => {
  await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
  const productId = text.replace("/showproduct", "").trim();
  const p = await ProductsModel.findById(productId).populate("category");
  if (!p) return;
  bot.sendPhoto(chatId, p.photo, {
    caption: captionText(p),
    parse_mode: "Markdown",
    reply_markup:
      chatId == BOT.ADMIN_ID ? adminProductKeyboard(p._id) : buyProduct(p._id),
  });
};

const handleDeleteProducts = async (queryData, chatId, messageId) => {
  const productId = queryData.split("_")[1];
  bot.editMessageCaption(deleteProduct(), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    reply_markup: deletePr(productId),
  });
};

const handleBackProducts = async (queryData, chatId, messageId) => {
  const productId = queryData.split("_")[1];
  const product = await ProductsModel.findById(productId).populate("category");
  bot.editMessageCaption(captionText(product), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    reply_markup: adminProductKeyboard(product._id),
  });
};

const handleEditProduct = async (queryData, chatId, messageId) => {
  const productId = queryData.split("_")[2];
  const product = await ProductsModel.findById(productId);
  bot.editMessageCaption(editProductText(), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(productId),
  });
};

const handleEditPrName = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_NAME,
  });
  bot.sendMessage(BOT.ADMIN_ID, "Mahsulot nomini kiriting 🔰");
};

const handleUpdateName = async (text, product) => {
  const updatePr = await ProductsModel.findByIdAndUpdate(
    product._id,
    { name: text, step: PRODUCT_REG_STATES.CONFIRMATION },
    { new: true }
  ).populate("category");
  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

const handleEditPrice = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_PRICE,
  });
  bot.sendMessage(BOT.ADMIN_ID, `Narxini kiriting (Masalan: 150000, 150 000)`);
};

const handleEditProductPrice = async (text, pr) => {
  const { error, value } = priceValidation.validate(text, {
    abortEarly: false,
  });
  if (error) return bot.sendMessage(BOT.ADMIN_ID, error.message);
  const updatePr = await ProductsModel.findByIdAndUpdate(pr._id, {
    price: value,
    step: PRODUCT_REG_STATES.CONFIRMATION,
  }).populate("category");
  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

const handleEditWeight = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_WEIGHT,
  });
  bot.sendMessage(
    BOT.ADMIN_ID,
    `Mahsulotning og'irligini kiriting:\n(Misol: 100gr, 1kg, 1 porsiya, 1.5kg, 1l, 500g, 0.5ml, 2dona)`
  );
};

const handleEditProductWeight = async (text, pr) => {
  const { error, value } = weightValidation.validate(text, {
    abortEarly: false,
  });
  if (error) return bot.sendMessage(BOT.ADMIN_ID, error.message);
  const updatePr = await ProductsModel.findByIdAndUpdate(pr._id, {
    weight: value,
    step: PRODUCT_REG_STATES.CONFIRMATION,
  }).populate("category");
  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

const handleEditKcal = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_CALORIES,
  });
  bot.sendMessage(
    BOT.ADMIN_ID,
    `Mahsulotning kkal ya'ni (Kaloriyasini kiriting):\n(Misol: 250 kcal, 1.5kkal, 3000 KCAL)`
  );
};

const handleEditDescription = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_DESCRIPTION,
  });
  bot.sendMessage(BOT.ADMIN_ID, `Mahsulot haqida ma'lumot kiriting:`);
};

const handleEditProductKcal = async (text, pr) => {
  const { error, value } = kcalValidation.validate(text, {
    abortEarly: false,
  });
  if (error) return bot.sendMessage(BOT.ADMIN_ID, error.message);
  const updatePr = await ProductsModel.findByIdAndUpdate(pr._id, {
    calories: value,
    step: PRODUCT_REG_STATES.CONFIRMATION,
  }).populate("category");
  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

const handleEditProductDesc = async (text, pr) => {
  const updatePr = await ProductsModel.findByIdAndUpdate(pr._id, {
    description: text,
    step: PRODUCT_REG_STATES.CONFIRMATION,
  }).populate("category");
  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

const handleEditPhoto = async (queryData, chatId, messageId) => {
  bot.deleteMessage(chatId, messageId);
  const productId = queryData.split("_")[1];
  await ProductsModel.findByIdAndUpdate(productId, {
    step: PRODUCT_REG_STATES.EDIT_PHOTO,
  });
  bot.sendMessage(BOT.ADMIN_ID, `Mahsulot rasmini kiriting (1 dona) 📸`);
};

const handleEditProductPhoto = async (msg, pr) => {
  const product = await ProductsModel.findOne({ _id: pr._id });

  if (product.photo) {
    const public_id = extractPublicId(product.photo);
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  }

  const file = msg.photo[msg.photo.length - 1];
  const fileLink = await bot.getFileLink(file.file_id);
  const upPhoto = await cloudinary.uploader.upload(fileLink, {
    folder: "kfc",
  });

  const updatePr = await ProductsModel.findByIdAndUpdate(product._id, {
    photo: upPhoto.secure_url,
    step: PRODUCT_REG_STATES.CONFIRMATION,
  }).populate("category");

  bot.sendPhoto(BOT.ADMIN_ID, updatePr.photo, {
    caption: captionText(updatePr),
    parse_mode: "Markdown",
    reply_markup: editProductKeyboard(updatePr._id),
  });
};

function extractPublicId(url) {
  try {
    const parts = url.split("upload/")[1];
    if (!parts) return null;
    const withoutVersion = parts.split("/").slice(1).join("/");
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (err) {
    return null;
  }
}

const handleDeletePr = async (queryData, chatId, messageId) => {
  try {
    const productId = queryData.split("_")[2];
    const findProduct = await ProductsModel.findById(productId);

    if (!findProduct)
      return bot.sendMessage(
        BOT.ADMIN_ID,
        `⚠️ Mahsulot topilmadi yoki allaqachon o‘chirilgan.`
      );

    if (findProduct.photo) {
      const public_id = extractPublicId(findProduct.photo);
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
    }

    await ProductsModel.findByIdAndDelete(productId);

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(
      BOT.ADMIN_ID,
      `✅ *Mahsulot muvaffaqiyatli o‘chirildi!*\n\n🗂 Endi bu mahsulot menyuda mavjud emas.`,
      {
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error("❌ O‘chirishda xatolik:", error);
    bot.sendMessage(chatId, "❌ Mahsulotni o‘chirishda xatolik yuz berdi.");
  }
};

const handleCancelDelete = async (queryData, chatId, messageId) => {
  const productId = queryData.split("_")[2];
  const product = await ProductsModel.findById(productId).populate("category");
  bot.editMessageCaption(captionText(product), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "Markdown",
    reply_markup: adminProductKeyboard(product._id),
  });
};

module.exports = {
  handleProductName,
  handleEnteringPrice,
  handleEnteringDescription,
  handleEnteringWeight,
  handleCheckHalal,
  handleEnteringCalories,
  handleEnteringPhoto,
  handleProductsPending,
  handleConfirmationProducts,
  handleCanceledProducts,
  handleShowProducts,
  handleDeleteProducts,
  handleEditProduct,
  handleBackProducts,
  handleDeletePr,
  handleCancelDelete,
  handleEditPrName,
  handleUpdateName,
  handleEditPrice,
  handleEditProductPrice,
  handleEditWeight,
  handleEditProductWeight,
  handleEditKcal,
  handleEditDescription,
  handleEditProductKcal,
  handleEditProductDesc,
  handleEditPhoto,
  handleEditProductPhoto,
};
