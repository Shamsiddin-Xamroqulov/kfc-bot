const { Schema, model } = require("mongoose");
const serverConfig = require("../config");
const { CLIENT_REG_STATES } = serverConfig;

const ClientModel = new Schema(
  {
    chatId: {
      type: String,
      unique: true,
    },
    first_name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    contact: {
      type: Object,
    },
    orders: [
      {
        status: {
          type: String,
          enum: ["pending", "confirmed", "delivered"],
          default: "pending",
        },
        total_price: Number,
        items: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: "products",
            },
            quantity: Number,
            price: Number,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    step: {
      type: String,
      default: CLIENT_REG_STATES.NONE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("clients", ClientModel);
