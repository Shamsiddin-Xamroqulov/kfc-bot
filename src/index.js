const connection = require("./lib/connection/connectionDb");

connection().catch(err => {
  console.log(`DB error`, err);
  process.exit(1);
});

require("./bot/bot");