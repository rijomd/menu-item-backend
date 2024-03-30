const mongoose = require("mongoose");
const { Schema } = mongoose;

const { User } = require("./userModel");
const { Item } = require("./itemModel");

const orderSchema = Schema(
    {
        totalAmount: { type: Number },
        totalItems: { type: Number },
        cancelComment: { type: String },
        itemList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ['Open', 'Closed', 'Cancelled'], default: 'Open' },
    },
    {
        timestamps: true,
    }
);
module.exports = {
    orderSchema,
    Order: mongoose.model("Order", orderSchema)
}
