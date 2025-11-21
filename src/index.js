const connection = require("./lib/connection/connectionDb");

connection().catch(err => {
  console.log(`DB error`, err);
  process.exit(1);
});

require("./bot/bot");

// const { config } = require("dotenv");
// config();
// const TelegramBot = require("node-telegram-bot-api");
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// const products = [
//   {
//     id: 1,
//     name: "Dudlangan dumba",
//     price: 150000,
//     image: "https://example.com/dumba.jpg",
//     desc: "Yuqori sifatli dudlangan dumba. 1 kg.",
//   },
//   {
//     id: 2,
//     name: "Xolodes",
//     price: 49990,
//     image: "https://example.com/xolodes.jpg",
//     desc: "Tabiiy mol go‘shtidan tayyorlangan xolodes.",
//   },
//   {
//     id: 3,
//     name: "Tovuq file go‘shti",
//     price: 54990,
//     image: "https://example.com/tovuq.jpg",
//     desc: "Dietik oqsilga boy tovuq filesi. 1 kg.",
//   },
// ];

// bot.onText(/\/start/, (msg) => {
//   bot.sendMessage(
//     msg.chat.id,
//     `Assalomu alaykum, ${msg.from.first_name}! 👋
// Siz bizning online do‘konimizdasiz. 
// Go‘sht mahsulotlarini ko‘rish uchun quyidagi buyruqni yozing:
// 👉 *@fs_77_Bot mahsulotlar*`,
//     { parse_mode: "Markdown" }
//   );
// });

// bot.on("inline_query", (query) => {
//   const q = query.query.toLowerCase();

//   console.log(query, q);
//   const results = products
//     .filter((p) => p.name.toLowerCase().includes(q) || q === "")
//     .map((p) => ({
//       type: "article",
//       id: String(p.id),
//       title: `${p.name} - ${p.price} UZS`,
//       description: `${p.price} UZS`,
//       thumb_url: p.image,
//       input_message_content: {
//         message_text: `🥩 *${p.name}*\n💰 Narxi: *${p.price} UZS*\n📜 Tavsif: ${p.desc}`,
//         parse_mode: "Markdown",
//       },
//     }));

//   bot.answerInlineQuery(query.id, results, { cache_time: 0 });
// });
