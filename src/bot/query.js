const CategoryModel = require("../model/Category.model");
const ProductsModel = require("../model/Products.model");
const bot = require("./bot");
const {
  handleConfirmCategory,
  handleCanceledCategory,
  handleEditCategory,
} = require("./handler/category.handler");
const {
  handleRegisterClient,
  handleUpdateStatus,
  handleBuyProduct,
  handleConfirmOrder,
  handleCancelOrder,
  handlePayment,
} = require("./handler/client.handler");
const {
  handleProductName,
  handleCheckHalal,
  handleConfirmationProducts,
  handleCanceledProducts,
  handleDeleteProducts,
  handleEditProduct,
  handleBackProducts,
  handleDeletePr,
  handleCancelDelete,
  handleEditPrName,
  handleEditPrice,
  handleEditWeight,
  handleEditKcal,
  handleEditDescription,
  handleEditPhoto,
} = require("./handler/product.handler");
const { handleCount, handleNext } = require("./helper/keyboard.helper");

bot.on("callback_query", async (query) => {
  const queryData = query.data;

  if (queryData === "register")
    return handleRegisterClient(query, query.message);

  if (
    queryData.startsWith("category_") &&
    !queryData.startsWith("category_edit_")
  )
    return handleProductName(queryData, query.message.chat.id);

  if (queryData === "confirmation") {
    return handleConfirmationProducts(
      query.message.chat.id,
      query.message.message_id
    );
  }

  if (queryData === "canceled") {
    return handleCanceledProducts(
      query.message.chat.id,
      query.message.message_id
    );
  }

  if (queryData.startsWith("halal"))
    return handleCheckHalal(queryData, query.message);

  if (
    queryData.startsWith("edit_") &&
    !queryData.startsWith("category_edit_") &&
    !queryData.startsWith("product_edit_")
  ) {
    return handleUpdateStatus(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  }

  if (queryData.startsWith("count")) return handleCount(queryData, query);
  if (queryData.startsWith("buy_")) return handleBuyProduct(queryData, query);

  if (
    queryData.startsWith("confirm_order_") &&
    !queryData.startsWith("confirm_delete_")
  )
    return handleConfirmOrder(queryData, query);
  if (
    queryData.startsWith("cancel_order_") &&
    !queryData.startsWith("cancel_delete_")
  )
    return handleCancelOrder(queryData, query);

  if (queryData.startsWith("payment_")) return handlePayment(query);

  if (queryData.startsWith("delete_"))
    return handleDeleteProducts(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (
    queryData.startsWith("confirm_delete_") &&
    !queryData.startsWith("cancel_delete_")
  )
    return handleDeletePr(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (queryData.startsWith("cancel_delete_"))
    return handleCancelDelete(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (queryData.startsWith("next"))
    return handleNext(query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("product_edit_"))
    return handleEditProduct(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );

  if (
    queryData.startsWith("confirm_category_") &&
    !queryData.startsWith("confirm_delete_")
  )
    return handleConfirmCategory(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (queryData.startsWith("canceled_category_"))
    return handleCanceledCategory(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (
    queryData.startsWith("category_edit_") &&
    !queryData.startsWith("product_edit_")
  )
    return handleEditCategory(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );
  if (queryData.startsWith("back_"))
    return handleBackProducts(
      queryData,
      query.message.chat.id,
      query.message.message_id
    );

  if (queryData.startsWith("name_")) return handleEditPrName(queryData, query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("price_")) return handleEditPrice(queryData, query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("weight_")) return handleEditWeight(queryData, query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("kcal_")) return handleEditKcal(queryData, query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("description_")) return handleEditDescription(queryData, query.message.chat.id, query.message.message_id);
  if (queryData.startsWith("photo_")) return handleEditPhoto(queryData, query.message.chat.id, query.message.message_id);
});

bot.on("inline_query", async (query) => {
  const q = query.query.toLowerCase().trim();
  let findQuery = {};
  let categoryId = null;

  if (q && q !== "all") {
    const category = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${q}$`, "i") },
    });

    if (category) {
      categoryId = category._id;
    }
  }

  if (categoryId) {
    findQuery = { category: categoryId };
  }
  const products = await ProductsModel.find(findQuery)
    .limit(20)
    .populate("category");

  const results = products.map((p) => ({
    type: "article",
    id: String(p._id),
    title: `${p.name} - ${p.price} UZS`,
    description: p.description || "Batafsil ma'lumot",
    thumb_url: p.photo,
    input_message_content: {
      message_text: `/showproduct${p._id}`,
    },
  }));

  await bot.answerInlineQuery(query.id, results, { cache_time: 0 });
});
