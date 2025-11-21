const registerInlineKeyboard = () => ({
  inline_keyboard: [
    [{ text: "Ro'yhatdan o'tish 📝", callback_data: "register" }],
  ],
});

const fastFoodMenu = (categories = []) => {
  const inline_keyboard = [
    [
      {
        text: "🛍️ Barcha Mahsulotlar",
        switch_inline_query_current_chat: "all",
      },
    ],
  ];

  for (let i = 0; i < categories.length; i += 2) {
    const row = [];

    if (categories[i]) {
      row.push({
        text: categories[i].name,
        switch_inline_query_current_chat: categories[i].name,
      });
    }

    if (categories[i + 1]) {
      row.push({
        text: categories[i + 1].name,
        switch_inline_query_current_chat: categories[i + 1].name,
      });
    }

    inline_keyboard.push(row);
  }
  const pagenation = [
    {
      text: `⏮`,
      callback_data: "prev_page",
    },
    {
      text: `📦/`,
      callback_data: `count_show`,
    },
    {
      text: `⏭`,
      callback_data: "next_page",
    },
  ];
  inline_keyboard.push(pagenation);

  return { inline_keyboard };
};

const categoryMenu = (categories = []) => {
  const inline_keyboard = [];

  for (let i = 0; i < categories.length; i += 2) {
    const row = [];

    if (categories[i]) {
      row.push({
        text: categories[i].name,
        callback_data: `category_${categories[i]._id}`,
      });
    }

    if (categories[i + 1]) {
      row.push({
        text: categories[i + 1].name,
        callback_data: `category_${categories[i + 1]._id}`,
      });
    }
    inline_keyboard.push(row);
  }

  return { inline_keyboard };
};

const checkProducts = () => ({
  inline_keyboard: [
    [
      { text: "✅ Tasdiqlayman", callback_data: "confirmation" },
      { text: "❌ Bekor qilish", callback_data: "canceled" },
    ],
  ],
});

const buyProduct = (id, count = 1) => ({
  inline_keyboard: [
    [
      { text: `➖`, callback_data: `count_minus_${id}` },
      { text: `📦/${count}`, callback_data: `count_show_${id}` },
      { text: `➕`, callback_data: `count_plus_${id}` },
    ],
    [
      {
        text: `🛒 Xarid qilish (${count}x)`,
        callback_data: `buy_${id}_${count}`,
      },
    ],
    [
      {
        text: `⏭ Davom eitsh`,
        callback_data: `next`,
      },
    ],
  ],
});

const adminProductKeyboard = (id) => ({
  inline_keyboard: [
    [
      { text: `✏ Tahrirlash`, callback_data: `product_edit_${id}` },
      { text: `❌ O'chirish`, callback_data: `delete_${id}` },
    ],
    [
      {
        text: `⏭ Davom eitsh`,
        callback_data: `next`,
      },
    ],
  ],
});

const isHalal = () => ({
  inline_keyboard: [
    [
      { text: "✅ Ha, Halol", callback_data: "halal_yes" },
      { text: "❌ Yo'q, Halol emas", callback_data: "halal_no" },
    ],
  ],
});

const editName = (id) => ({
  inline_keyboard: [
    [{ text: "✏ Ismni yangilash", callback_data: `edit_${id}` }],
  ],
});

const confirmKeyboard = (chatId, total_price) => ({
  inline_keyboard: [
    [
      {
        text: "✅ Tasdiqlash",
        callback_data: `confirm_order_${chatId}_totalPrice_${total_price}`,
      },
      { text: "❌ Bekor qilish", callback_data: `cancel_order_${chatId}` },
    ],
  ],
});

const paymentKeyboard = (total_price) => ({
  inline_keyboard: [
    [
      { text: "💳 PayMe", callback_data: `payment_${total_price}` },
      { text: "💵 Click", callback_data: `payment_${total_price}` },
      { text: "🏦 PayNet", callback_data: `payment_${total_price}` },
    ],
    [{ text: "❌ Bekor qilish", callback_data: "cancel_payment" }],
  ],
});

const addedCt = (id) => ({
  inline_keyboard: [
    [
      { text: `✅ Ha, saqlash`, callback_data: `confirm_category_${id}` },
      { text: `❌ Bekor qilish`, callback_data: `canceled_category_${id}` },
    ],
    [{ text: `✏ Tahrirlash`, callback_data: `category_edit_${id}` }],
  ],
});

const deletePr = (id) => ({
  inline_keyboard: [
    [
      { text: `✅ Ha, o‘chirilsin`, callback_data: `confirm_delete_${id}` },
      { text: `❌ Yo‘q, bekor qilish`, callback_data: `cancel_delete_${id}` },
    ],
  ],
});

const editProductKeyboard = (productId) => ({
  inline_keyboard: [
    [{ text: "🏷 Nomi", callback_data: `name_${productId}` }],
    [
      { text: "💰 Narxi", callback_data: `price_${productId}` },
      { text: "⚖️ Og‘irligi", callback_data: `weight_${productId}` },
    ],
    [
      { text: "🔥 Kkal", callback_data: `kcal_${productId}` },
      { text: "📜 Tavsif", callback_data: `description_${productId}` },
    ],
    [{ text: "🖼 Rasm", callback_data: `photo_${productId}` }],
    [{ text: `⏮ Orqaga`, callback_data: `back_${productId}` }],
  ],
});

module.exports = {
  fastFoodMenu,
  categoryMenu,
  checkProducts,
  registerInlineKeyboard,
  buyProduct,
  isHalal,
  editName,
  confirmKeyboard,
  paymentKeyboard,
  adminProductKeyboard,
  addedCt,
  deletePr,
  editProductKeyboard,
};
