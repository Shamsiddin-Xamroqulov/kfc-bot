const {Schema, model} = require("mongoose");
const serverConfig = require("../config");
const {PRODUCT_REG_STATES} = serverConfig;

const ProductsModel = new Schema({
    chatId: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categories" 
    },
    name: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
    },
    weight: {
        type: String,
    },
    isHalal: {
        type: Boolean,
        default: false
    },
    calories: {
        type: String,
    },
    description: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
    },
    step: {
        type: String,
        default: PRODUCT_REG_STATES.NONE
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("products", ProductsModel);