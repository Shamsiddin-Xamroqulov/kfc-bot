const mongoose = require("mongoose");
const serverConfig = require("../../config.js");
const {DB} = serverConfig;

async function connection () {
    await mongoose.connect(DB.dbUri, {
        dbName: DB.DB_NAME
    });
    console.log(`Db successfuly connection`)
};

module.exports = connection;