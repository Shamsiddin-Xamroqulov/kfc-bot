const clientEnteringPhone = () => ({
  keyboard: [[{ text: "Telefon Raqamni yuboring 📞", request_contact: true }]],
  resize_keyboard: true,
});

const adminKeyboard = () => ({
  keyboard: [
    [{ text: "🍔 Mahsulotlar" }, { text: "🛒 Mahsulotlar menyusi" }],
    [{ text: "👥 Clientlarni ko‘rish" }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const adminProductsKeyboard = () => ({
  keyboard: [
    [
      { text: "🧩 Kategoriya qo‘shish"},
      { text: "🛍 Mahsulot qo‘shish"},
    ],
    [{ text: "✏️ Mahsulotlarni tahrirlash"}],
    [{ text: "⬅ Orqaga"}],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const clientKeyboard = () => ({
  keyboard: [[{ text: "🍔 Mahsulotlar" }, { text: "👤 Shaxsiy kabinet" }]],
  resize_keyboard: true,
  one_time_keyboard: false,
});

const clientOrdersKeyboard = () => ({
  keyboard: [
    [
      { text: "📱 Contactingizni", request_contact: true },
      { text: "🍔 Mahsulotlar" },
    ],
    [{ text: "🧾 Buyurtma berish" }, { text: "👤 Shaxsiy kabinet" }],
  ],
  resize_keyboard: true,
  one_time_keyboard: false,
});

module.exports = {
  adminKeyboard,
  clientKeyboard,
  clientOrdersKeyboard,
  clientEnteringPhone,
  adminProductsKeyboard
};
