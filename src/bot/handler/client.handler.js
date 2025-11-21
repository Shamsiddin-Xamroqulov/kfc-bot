const ClientModel = require("../../model/Client.model");
const bot = require("../bot");
const {
  clientStartText,
  clientRegistered,
  clientData,
  paymentText,
  handleConfirmProduct,
} = require("../../other/text.service");
const { clientKeyboard, clientEnteringPhone } = require("../keys/keyboard");
const {
  registerInlineKeyboard,
  editName,
  confirmKeyboard,
  paymentKeyboard,
} = require("../keys/inline.js");
const { BOT, CLIENT_REG_STATES } = require("../../config.js");
const ProductsModel = require("../../model/Products.model.js");
const {
  priceValidation,
} = require("../../utils/validation/product.validation.js");

const clientHandler = async (msg, chatId) => {
  let client = await ClientModel.findOne({ chatId });
  if (!client) {
    client = await ClientModel.create({ chatId, step: CLIENT_REG_STATES.NONE });
    return bot.sendMessage(chatId, clientRegistered(msg), {
      parse_mode: "HTML",
      reply_markup: registerInlineKeyboard(),
    });
  } else if (client.step == CLIENT_REG_STATES.NONE) {
    return bot.sendMessage(chatId, clientRegistered(msg), {
      parse_mode: "HTML",
      reply_markup: registerInlineKeyboard(),
    });
  }
  if (client.step === CLIENT_REG_STATES.CONFIRMATION) {
    return bot.sendMessage(chatId, clientStartText(msg), {
      parse_mode: "HTML",
      reply_markup: clientKeyboard(),
    });
  }
};

const handleRegisterClient = async (query, msg) => {
  const chatId = msg.chat.id;
  await ClientModel.findOneAndUpdate(
    { chatId },
    { step: CLIENT_REG_STATES.ENTERING_NAME }
  );
  bot.sendMessage(chatId, `Ismingizni kiriting`);
};

const handleEnteringPhone = async (msg, text, chatId, client) => {
  await ClientModel.findByIdAndUpdate(client._id, {
    first_name: text,
    username: msg.chat.username || "",
    step: CLIENT_REG_STATES.ENTERING_PHONE,
  });
  bot.sendMessage(chatId, `Telefon raqamingizni kiriging`, {
    reply_markup: clientEnteringPhone(),
  });
};

const handleConfirmationClient = async (msg, chatId, clientContact, client) => {
  if (clientContact) {
    await ClientModel.findByIdAndUpdate(client._id, {
      contact: clientContact,
      step: CLIENT_REG_STATES.CONFIRMATION,
    });
    bot.sendMessage(chatId, clientStartText(msg), {
      parse_mode: "HTML",
      reply_markup: clientKeyboard(),
    });
  }
};

const handleShowProfile = async (msg, chatId, client) => {
  if (client.step == CLIENT_REG_STATES.CONFIRMATION) {
    const showClients = await ClientModel.findOne({ chatId });
    bot.sendMessage(chatId, clientData(showClients), {
      parse_mode: "HTML",
      reply_markup: editName(client._id),
    });
  }
};

const handleUpdateStatus = async (queryData, chatId, messageId) => {
  const clientId = queryData.split("_")[1];
  await ClientModel.findByIdAndUpdate(clientId, {
    step: CLIENT_REG_STATES.EDIT_NAME,
  });
  bot.editMessageText(`Yangi Ismingizni kiriting 👇`, {
    chat_id: chatId,
    message_id: messageId,
  });
};

const handleEditClientName = async (text, chatId) => {
  await ClientModel.findOneAndUpdate(
    { chatId },
    {
      first_name: text,
      step: CLIENT_REG_STATES.CONFIRMATION,
    }
  );
  const client = await ClientModel.findOne({ chatId });
  bot.sendMessage(chatId, clientData(client), {
    parse_mode: "HTML",
    reply_markup: editName(client._id),
  });
};

const handleBuyProduct = async (queryData, query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const queryId = query.id;

  const [_, productId, countStr] = queryData.split("_");
  const count = parseInt(countStr) || 1;

  const product = await ProductsModel.findById(productId).populate("category");
  if (!product) {
    return bot.answerCallbackQuery(queryId, {
      text: "❌ Mahsulot topilmadi.",
      show_alert: true,
    });
  }

  let client = await ClientModel.findOne({ chatId }).populate({
    path: "orders.items.product",
    model: "products",
  });
  if (!client) {
    await bot.answerCallbackQuery(queryId, {
      text: "❌ Ro‘yxatdan o‘tmagansiz.",
      show_alert: true,
    });
    return bot.sendMessage(chatId, "❌ Siz ro‘yxatdan o‘tmagansiz.");
  }

  let rawPrice = product.price;
  if (typeof rawPrice === "string") rawPrice = rawPrice.replace(/\s/g, "");
  const unitPrice = Number(rawPrice);
  if (isNaN(unitPrice)) {
    return bot.answerCallbackQuery(queryId, {
      text: "❌ Narx noto'g'ri formatda.",
      show_alert: true,
    });
  }

  const itemTotalPrice = unitPrice * count;
  if (!Array.isArray(client.orders)) client.orders = [];

  let order = client.orders.find(
    (o) => o.status === "pending" || o.status == null
  );
  if (!order) {
    order = {
      status: "pending",
      total_price: 0,
      items: [],
      createdAt: new Date(),
    };
    client.orders.push(order);
  }

  const existingItem = order.items.find(
    (item) => String(item.product) === String(product._id)
  );
  if (existingItem) {
    existingItem.quantity += count;
    existingItem.price += itemTotalPrice;
  } else {
    order.items.push({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        calories: product.calories,
        isHalal: product.isHalal,
        description: product.description,
      },
      quantity: count,
      price: itemTotalPrice,
    });
  }

  order.total_price = order.items.reduce((sum, item) => sum + item.price, 0);

  try {
    await client.save();
    bot.answerCallbackQuery(queryId, {
      text: `🛒 Savatga qo'shildi! Jami: ${order.total_price.toLocaleString(
        "uz-UZ"
      )} so'm`,
    });
  } catch (err) {
    console.error("❌ Buyurtma saqlashda xato:", err.message);
    return bot.answerCallbackQuery(queryId, {
      text: "❌ Saqlashda xatolik yuz berdi.",
      show_alert: true,
    });
  }

  const itemsList = await Promise.all(
    order.items.map(async (item) => {
      const itemProduct = await ProductsModel.findById(item.product).populate(
        "category"
      );

      return `
🍔 *${itemProduct.name || "Noma'lum mahsulot"}*
💰 Narxi: *${
        itemProduct.price ? itemProduct.price + " UZS" : "Narx mavjud emas"
      }*

⚖️ Og‘irligi: *${itemProduct.weight || "Ko‘rsatilmagan"}*
🔥 Kkal: *${itemProduct.calories || "Ko‘rsatilmagan"}*
🕌 Halol: *${itemProduct.isHalal ? "✅ Ha, halol" : "❌ Yo‘q"}*

📜 *Tavsif*: ${itemProduct.description || "Tavsif yo‘q"}

📦 Miqdor: *${item.quantity} dona* (${item.price.toLocaleString("uz-UZ")} so'm)
`;
    })
  );

  const newCaption = `
🛍 *Sizning savatingiz:*
${itemsList.join("\n")}
💰 *JAMI:* *${order.total_price.toLocaleString("uz-UZ")} so‘m*
Buyurtmani rasmiylashtirasizmi?
`;
  try {
    bot.editMessageCaption(newCaption, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "Markdown",
      reply_markup: confirmKeyboard(chatId, order.total_price),
    });
  } catch (err) {
    if (!err.message.includes("message is not modified"))
      console.error("❌ editMessageCaption xatosi:", err.message);
  }
};

const handleConfirmOrder = async (queryData, query) => {
  const chatId = query.message.chat.id;
  const totalPrice = queryData.split("_")[4];
  bot.sendMessage(chatId, paymentText(totalPrice), {
    parse_mode: "Markdown",
    reply_markup: paymentKeyboard(totalPrice),
  });
};

const handleCancelOrder = async (queryData, query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  await ClientModel.updateOne(
    { chatId },
    { $pull: { orders: { status: "pending" } } }
  );

  await bot.deleteMessage(chatId, messageId);
};

const handlePayment = async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const queryData = query.data;

  await bot.editMessageText(`💰 Iltimos, to‘lov summasini kiriting:`, {
    chat_id: chatId,
    message_id: messageId,
  });
  await ClientModel.updateOne(
    { chatId, "orders.status": "pending" },
    { $set: { "orders.$.status": "confirmed" } }
  );
};

const handleProductDelivered = async (text, chatId) => {
  const validation = priceValidation.validate(text, { abortEarly: false });
  if (validation.error) {
    return bot.sendMessage(chatId, `❌ Xato: ${validation.error.message}`);
  }

  await ClientModel.findOneAndUpdate(
    { chatId, "orders.status": "confirmed" },
    { $set: { "orders.$.status": "delivered" } }
  );
  bot.sendMessage(chatId, handleConfirmProduct(), { parse_mode: "Markdown" });
};

module.exports = {
  clientHandler,
  handleRegisterClient,
  handleEnteringPhone,
  handleConfirmationClient,
  handleShowProfile,
  handleUpdateStatus,
  handleEditClientName,
  handleBuyProduct,
  handleConfirmOrder,
  handleCancelOrder,
  handlePayment,
  handleProductDelivered,
};
