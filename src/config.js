const {config} = require("dotenv");
config();

const serverConfig = {
    DB: {
        dbUri: process.env.dbUri,
        DB_NAME: process.env.DB_NAME,
    },
    BOT: {
        BOT_TOKEN: process.env.BOT_TOKEN,
        ADMIN_ID: process.env.ADMIN_ID,
    },
    CLIENT_REG_STATES: {
        NONE: "none",
        ENTERING_NAME: "client_entering_name",
        ENTERING_PHONE: "client_entering_phone",
        EDIT_NAME: "edit_name",
        CONFIRMATION: "successfull",
    },
    CATEGORY_REG_STATES: {
        NONE: "none",
        CATEGORY_PENDING: "category_pending",
        EDIT_CATEGORY: "edit_category",
        CONFIRMATION: "successfuly"
    },
    PRODUCT_REG_STATES: {
        NONE: "none",
        CHOOSING_CATEGORY: "choosing_category",
        ENTERING_NAME: "name",
        ENTERING_PRICE: "price",
        ENTERING_WEIGHT: "weight",
        ENTERING_IS_HALAL: "Halal",
        ENTERING_CALORIES: "calories",
        ENTERING_DESCRIPTION: "description",
        ENTERING_PHOTO: "photo",
        EDIT_NAME: "edit_name",
        EDIT_PRICE: "edit_price",
        EDIT_WEIGHT: "edit_weight",
        EDIT_CALORIES: "edit_calories",
        EDIT_DESCRIPTION: "edit_description",
        EDIT_PHOTO: "edit_photo",
        PENDING: "product_pending",
        CANCELED: "canceled",
        CONFIRMATION: "successfully_added",
    },
    CLOUDINARY_CONFIG: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET_KEY: process.env.API_SECRET_KEY,
    },
};

module.exports = serverConfig;