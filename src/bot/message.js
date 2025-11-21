const {
  BOT,
  PRODUCT_REG_STATES,
  CLIENT_REG_STATES,
  CATEGORY_REG_STATES,
} = require("../config.js");
const CategoryModel = require("../model/Category.model.js");
const ClientModel = require("../model/Client.model.js");
const ProductsModel = require("../model/Products.model.js");
const bot = require("./bot");
const {
  handleShowClients,
  handleAdminShowKeyboards,
  handleBackKeyboard,
} = require("./handler/admin.handler.js");
const {
  handleAddCategory,
  handleAddedCategory,
  handleUpdateCategory,
} = require("./handler/category.handler.js");
const {
  handleEnteringPhone,
  handleConfirmationClient,
  handleShowProfile,
  handleEditClientName,
  handleProductDelivered,
} = require("./handler/client.handler.js");
const {
  handleEnteringPrice,
  handleEnteringDescription,
  handleEnteringWeight,
  handleEnteringCalories,
  handleEnteringPhoto,
  handleProductsPending,
  handleShowProducts,
  handleUpdateName,
  handleEditProductPrice,
  handleEditProductWeight,
  handleEditProductKcal,
  handleEditProductDesc,
  handleEditProductPhoto,
} = require("./handler/product.handler.js");
const { startHandler } = require("./handler/start.handler");
const {
  keyboardHelper,
  handleShowAddedProducts,
} = require("./helper/keyboard.helper.js");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const type = msg.chat.type;
  const text = msg.text;
  const clientContact = msg.contact;
  const products = await ProductsModel.findOne({
    chatId,
    step: { $ne: PRODUCT_REG_STATES.SUCCESSFULLY_ADDED },
  })
    .sort({ createdAt: -1 })
    .populate("category");

  const getEditingProduct = async () => {
    return await ProductsModel.findOne({
      step: {
        $in: [
          PRODUCT_REG_STATES.EDIT_NAME,
          PRODUCT_REG_STATES.EDIT_PRICE,
          PRODUCT_REG_STATES.EDIT_WEIGHT,
          PRODUCT_REG_STATES.EDIT_CALORIES,
          PRODUCT_REG_STATES.EDIT_DESCRIPTION,
          PRODUCT_REG_STATES.EDIT_PHOTO,
        ],
      },
    }).populate("category");
  };

  const client = await ClientModel.findOne({ chatId });

  const clientOrder = await ClientModel.findOne({
    chatId,
    "orders.status": "confirmed",
  });
  const category = await CategoryModel.findOne({
    step: CATEGORY_REG_STATES.NONE,
  }).sort({ createdAt: -1 });
  const editCategory = await CategoryModel.findOne({
    step: CATEGORY_REG_STATES.EDIT_CATEGORY,
  });

  if (type !== "private") return;
  if (text == "/start") return startHandler(msg, chatId);

  if (text == "🍔 Mahsulotlar") {
    return keyboardHelper(chatId);
  }
  if (chatId == BOT.ADMIN_ID) {
    if (text == "🛒 Mahsulotlar menyusi") return handleAdminShowKeyboards();
    if (text == "🧩 Kategoriya qo‘shish") return handleAddCategory();
    if (text == "⬅ Orqaga") return handleBackKeyboard();
    if (text == "🛍 Mahsulot qo‘shish") return handleShowAddedProducts();
    if (text == "👥 Clientlarni ko‘rish") return handleShowClients();
    if (text == "✏️ Mahsulotlarni tahrirlash") return keyboardHelper(chatId);
  }

  if (category) {
    return handleAddedCategory(text, category);
  }

  if (editCategory) {
    return handleUpdateCategory(text, editCategory);
  }

  if (products) {
    if (products.step == PRODUCT_REG_STATES.ENTERING_NAME) {
      return handleEnteringPrice(chatId, text, products);
    }
    if (products.step == PRODUCT_REG_STATES.ENTERING_PRICE) {
      return handleEnteringDescription(msg, text, products);
    }
    if (products.step == PRODUCT_REG_STATES.ENTERING_WEIGHT) {
      return handleEnteringWeight(msg, text, products);
    }
    if (products.step == PRODUCT_REG_STATES.ENTERING_CALORIES) {
      return handleEnteringCalories(chatId, text);
    }
    if (products.step == PRODUCT_REG_STATES.ENTERING_DESCRIPTION) {
      return handleEnteringPhoto(msg, text, products);
    }
    if (products.step == PRODUCT_REG_STATES.ENTERING_PHOTO) {
      return handleProductsPending(msg, products);
    }
  }

  const product = await getEditingProduct();

  if (product) {
    if (product.step === PRODUCT_REG_STATES.EDIT_NAME) {
      return handleUpdateName(text, product);
    } else if (product.step === PRODUCT_REG_STATES.EDIT_PRICE) {
      return handleEditProductPrice(text, product);
    } else if (product.step === PRODUCT_REG_STATES.EDIT_WEIGHT) {
      return handleEditProductWeight(text, product);
    } else if (product.step === PRODUCT_REG_STATES.EDIT_CALORIES) {
      return handleEditProductKcal(text, product);
    } else if (product.step === PRODUCT_REG_STATES.EDIT_DESCRIPTION) {
      return handleEditProductDesc(text, product);
    } else if (product.step === PRODUCT_REG_STATES.EDIT_PHOTO) {
      return handleEditProductPhoto(msg, product);
    }
  }
  if (client) {
    if (client.step == CLIENT_REG_STATES.ENTERING_NAME) {
      await handleEnteringPhone(msg, text, chatId, client);
    }
    if (client.step == CLIENT_REG_STATES.ENTERING_PHONE) {
      await handleConfirmationClient(msg, chatId, clientContact, client);
    }
    if (text == "👤 Shaxsiy kabinet") {
      return handleShowProfile(msg, chatId, client);
    }
    if (client.step == CLIENT_REG_STATES.EDIT_NAME) {
      return handleEditClientName(text, chatId);
    }
    if (clientOrder) {
      return handleProductDelivered(text, chatId);
    }
  }

  if (text && text.startsWith("/showproduct")) {
    return handleShowProducts(msg, chatId, text);
  }
});
