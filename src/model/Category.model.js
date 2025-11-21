const {Schema, model} = require("mongoose");
const serverConfig = require("../config");
const {CATEGORY_REG_STATES} = serverConfig;

const CategoryModel = new Schema({
    name: {
        type: String,
        trim: true,
    },
    step: {
        type: String,
        default: CATEGORY_REG_STATES.NONE
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("categories", CategoryModel);