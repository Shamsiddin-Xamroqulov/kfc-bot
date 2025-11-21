const adminStartText = (msg, username) => {
  return `
🛍️ <b>Assalomu alaykum, ${msg.from.first_name}!</b>
Siz <b>GoldenBite botining admin panelidasiz. 👨‍💼</b>  
    
Bu yerda siz quyidagi amallarni bajarishingiz mumkin:
🔹 Mahsulotlar ro‘yxatini ko‘rish  
🔹 Yangi mahsulot qo‘shish  
🔹 Mijozlarni kuzatish

Go‘sht mahsulotlarini ko‘rish uchun inline qidiruvdan foydalaning:
👉 <u>@${username}</u> mahsulotlar  

Yoki yangi mahsulot qo‘shmoqchi bo‘lsangiz:
➕ <b>Mahsulotlarni Qo'shish</b> tugmasini bosing.  

<b>Botdan unumli foydalanish uchun iltimos, menyudagi buyruqlardan foydalaning.</b>
`;
};

const clientRegistered = (msg) => {
  return `
👋 Assalomu alaykum ${msg.from.first_name || ""}!

Ro‘yxatdan o‘tish jarayoniga xush kelibsiz 📝  
Iltimos, quyidagi bosqichlarni ketma-ket to‘ldiring:

1️⃣ Ism va familiyangizni kiriting  
2️⃣ 📞 Telefon raqamingizni kiriting

Jarayonni yakunlagach, siz bizning xizmatlardan to‘liq foydalanishingiz mumkin bo‘ladi ✅
  `;
};

const clientStartText = (msg) => {
  return `
🍔 <b>Assalomu alaykum, ${msg.from.first_name}!</b>  
Sizni <b>GoldenBite FastFood</b> botida ko‘rib turganimizdan xursandmiz! 👋  

Bu bot orqali siz:  
🔹 Tabiiy va sifatli FastFood mahsulotlarini ko‘rishingiz mumkin  
🔹 Buyurtma berish yoki ma’lumot olish imkoniga egasiz  
🔹 Admin bilan bog‘lanishingiz mumkin  

Go‘sht mahsulotlarini ko‘rish uchun inline qidiruvdan foydalaning:  
👉 <u>@fc_77_Bot</u> mahsulotlar  

Yoki pastdagi menyudan kerakli bo‘limni tanlang 👇  

<b>GoldenBite — Sifat, Ta’m va Ishonch!</b> 🍕
  `;
};

const productsMenu = () => {
  return `
🍔 *FastFoodlar menyusiga xush kelibsiz!* 😎  

Bu yerda siz eng *mazali* va *issiq* fastfood taomlarini topasiz 🔥  
Har bir taom *yangi masalliqlardan* tayyorlanadi va *tezkor yetkazib beriladi!* 🚗💨  

📋 *Menyudan tanlang:*  
🍕 Pitsa turlari  
🍔 Burgerlar  
🌯 Lavash va donerlar  
🍟 Kartoshka fri & setlar
🥤 Ichimliklar

*FastFood — Mazza qilib ovqatlaning!* 🍔🔥
`;
};

const newProductsText = () => {
  return `
🌟 *Yangi mahsulot qo‘shish bo‘limi* 🌟

🛒 _Iltimos, quyidagi ma’lumotlarni kiriting:_

1️⃣ *Kategoriya nomi* — (masalan: Lavash)
2️⃣ *Mahsulot nomi* — (masalan: Lavash, Pishloqli)
3️⃣ *Narxi* (so‘mda) — (masalan: 15500000)
4️⃣ *Og'irlik* (kg, g, gr) - (masalan: 1kg, 500g)
5️⃣ *Halol* (⚠️ Eslatma botda faqat halol narsalar sotiladi)
6️⃣ *Calories* (kcalda) - (masalan: 500kcal)
7️⃣ *Tavsif* _(ixtiyoriy)_ — qisqacha ma’lumot yozing
8️⃣ *Mahsulot rasmi* 📸 — bitta rasm yuboring

⚠️ _Eslatma_: Har bir bosqichda bot sizdan alohida ma’lumot so‘raydi.  
Ma’lumotlar to‘liq kiritilgach, bot mahsulotni bazaga qo‘shadi ✅

Categoryni kiriting 👇
`;
};

const showLastProduct = (product) => {
  return `
  <b>${product.category.name || "Ko‘rsatilmagan"}</b>
  
🍔 <b>${product.name || "Noma'lum mahsulot"}</b>
💰 <b>Narx:</b> ${product.price ? product.price + " UZS" : "Narx mavjud emas"}
⚖️ <b>Og‘irligi:</b> ${product.weight || "Ko‘rsatilmagan"}
🔥 <b>Kcal:</b> ${product.calories || "Ko‘rsatilmagan"}
🕌 <b>Halol:</b> ${product.isHalal ? "✅ Ha, halol" : "❌ Yo‘q"}

📜 <b>Tavsif:</b> ${product.description || "Tavsif mavjud emas"}

✅ Mahsulotni tasdiqlaysizmi yoki bekor qilasizmi?
`;
};

// Markdown v2 uchun escape funksiyasi
const escapeMarkdown = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/_/g, "\\_")
    .replace(/\*/g, "\\*")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/~/g, "\\~")
    .replace(/`/g, "\\`")
    .replace(/>/g, "\\>")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/=/g, "\\=")
    .replace(/\|/g, "\\|")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/!/g, "\\!");
};

const showClients = (clients) => {
  if (!clients || clients.length === 0) {
    return "👥 Hozircha hech qanday mijoz topilmadi.";
  }

  return clients
    .map((client, index) => {
      const order =
        client.orders && client.orders.length > 0
          ? client.orders[client.orders.length - 1]
          : null;

      return `
╔═ 🔹 *Mijoz #${index + 1}* ════════════
👤 Ism: ${escapeMarkdown(client.first_name || "Noma'lum")}
📞 Telefon: ${escapeMarkdown(client.contact.phone_number || "Ko‘rsatilmagan")}

📦 *Buyurtma ma’lumotlari:*
📋 Holat: ${escapeMarkdown(order?.status || "Yo‘q")}
💰 Umumiy summa: ${
        order?.total_price
          ? escapeMarkdown(order.total_price) + " UZS"
          : "0 UZS"
      }

${
  order?.items && order.items.length > 0
    ? order.items
        .map(
          (item, i) =>
            `   ${i + 1}. ${escapeMarkdown(
              item.product?.name || "Noma'lum mahsulot"
            )} — ${item.quantity} dona × ${escapeMarkdown(item.price)} UZS`
        )
        .join("\n")
    : "🛒 Mahsulotlar mavjud emas."
}

🕒 Ro‘yxatdan o‘tgan: ${escapeMarkdown(
        new Date(client.createdAt).toLocaleString("uz-UZ")
      )}
╚═══════════════════════════════
`;
    })
    .join("\n");
};

const clientData = (cl) => {
  const date = new Date(cl.createdAt).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    hour12: false,
  });

  return `
<b>🧾 Mijoz ma'lumotlari</b>

👤 <b>Ism:</b> ${cl.first_name || "—"}
📛 <b>Username:</b> @${cl.username || "yo'q"}
📞 <b>Telefon:</b> ${cl.contact?.phone_number || "—"}
📅 <b>Ro‘yxatdan o‘tgan sana:</b> ${date}
`;
};

const paymentText = (totalPrice) => {
  return `
🛒 Sizning savatingiz tayyor!
  
Endi to‘lovni amalga oshirish va buyurtmani yakunlash vaqti keldi.  
Quyidagi to‘lov usullaridan birini tanlang:
  
💳 *PayMe* — mobil ilova orqali tez va qulay to‘lov.  
💵 *Click* — Click tizimi orqali hisob-kitob qilish imkoniyati.  
🏦 *PayNet* — bank terminali va onlayn to‘lovni qo‘llab-quvvatlaydi.  

🧮 Jami Narx: *${totalPrice}*
  
Kerak bo‘lsa, buyurtmani bekor qilish uchun pastdagi tugmani bosing.
  `;
};

const handleConfirmProduct = () => {
  return `
🎉 *Buyurtmangiz qabul qilindi!*

💰 To‘lov muvaffaqiyatli amalga oshirildi.  
🚚 Sizning buyurtmangiz tez orada yetkazib beriladi.

🙏 Bizga ishonch bildirganingiz uchun rahmat!  
Iltimos, buyurtmangizni qabul qilishni kuting.
`;
};

const showAdminKeyboards = () => {
  return `
🍟 *Mahsulotlar bo‘limi* 🍗

Bu yerda siz quyidagi amallarni bajarishingiz mumkin 👇  

1️⃣ *Yangi kategoriya qo‘shish* — masalan: Lavash, Ichimliklar, Desertlar  
2️⃣ *Yangi mahsulot qo‘shish* — nomi, narxi, tavsifi va rasmi bilan  
3️⃣ *Mavjud mahsulotni tahrirlash (edit)* — nomini, narxini yoki rasmni yangilash  

🛠 _Har bir amalni tanlaganingizdan so‘ng, bot sizni kerakli bosqichlar orqali yo‘naltiradi._  
Barcha o‘zgarishlar bazaga saqlanadi va darhol menyuda aks etadi ✅  

Tanlang, qaysi amalni bajarishni xohlaysiz? 👇
  `;
};

const addedCategory = (name) => {
  return `
📁 *Yangi kategoriya qo‘shish jarayoni*  

Siz quyidagi ma’lumotlarni yubordingiz:  

🔹 *Kategoriya nomi:* _${name}_  

Iltimos, quyidagi ma’lumotni tasdiqlang.  
Agar to‘g‘ri bo‘lsa — “✅ Ha, saqlash” tugmasini bosing.  
Agar xato kiritilgan bo‘lsa — “❌ Bekor qilish” tugmasini tanlang.

*Tasdiqlaysizmi?*
`;
};

const editCategory = () => {
  return `
📝 *Kategoriya tahrirlash bo‘limi*

Iltimos, ushbu kategoriyaga yangi nom kiriting 👇  
Masalan:
> 🍔 Burgerlar  
> 🥤 Ichimliklar  
> 🍰 Shirinliklar  

⚠️ *Eslatma:*
- Kategoriya nomi bosh harf bilan boshlanishi kerak.  
- Emoji bilan boshlash tavsiya etiladi.  
- Nom iloji boricha qisqa va tushunarli bo‘lsin.

Yangi nomni kiriting ⤵️
`;
}

const deleteProduct = () => {
  return `
🗑 Siz ushbu mahsulotni o‘chirmoqchimisiz?

❗ Siz tanlagan mahsulotni o‘chirish arafasidasiz. Bu amalni tasdiqlaganingizdan so‘ng mahsulot bazadan **butunlay o‘chiriladi**.

✅ O‘chirishni tasdiqlaysizmi?
  `
};

const captionText = (p) => {
  return `
*${p.category?.name || "Ko‘rsatilmagan"}*

🍔 *${p.name || "Noma'lum mahsulot"}*
💰 Narxi: *${p.price ? p.price + " UZS" : "Narx mavjud emas"}*
  
⚖️ Og‘irligi: *${p.weight || "Ko‘rsatilmagan"}*
🔥 Kkal: *${p.calories || "Ko‘rsatilmagan"}*
🕌 Halol: *${p.isHalal ? "✅ Ha, halol" : "❌ Yo‘q"}*
  
📜 *Tavsif*: ${p.description || "Tavsif yo‘q"}
`;
};

const editProductText = () => {
  return `
✏️ *Mahsulot tahrirlash bo‘limi*

Bu yerda siz tanlangan mahsulot ma’lumotlarini yangilashingiz mumkin.  

Quyidagi bo‘limlardan birini tanlang 👇  

▫️ *Nomi* – mahsulot nomini o‘zgartirish uchun  
▫️ *Narxi* – mahsulot narxini yangilash uchun  
▫️ *Og‘irligi / Hajmi* – mahsulot miqdorini tuzatish uchun  
▫️ *Kkal* – kaloriyasini o‘zgartirish uchun  
▫️ *Tavsif* – mahsulot haqida izohni yangilash uchun  
▫️ *Rasm* – yangi surat yuklash uchun  

🛠 *Qaysi qismini tahrirlashni xohlaysiz?*
`;
};

module.exports = {
  adminStartText,
  clientStartText,
  productsMenu,
  newProductsText,
  showLastProduct,
  clientRegistered,
  showClients,
  clientData,
  paymentText,
  handleConfirmProduct,
  showAdminKeyboards,
  addedCategory,
  editCategory,
  deleteProduct,
  captionText,
  editProductText
};
