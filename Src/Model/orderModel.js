const mongoose = require("mongoose");
const { Schema } = mongoose;

const { User } = require("./userModel");
const { Item } = require("./itemModel");

const orderSchema = Schema(
    {
        totalAmount: { type: Number },
        totalItems: { type: Number },
        cancelComment: { type: String },
        itemList: [{ type: Object }], // need to change slightly 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ['Open', 'Closed', 'Cancelled', 'Approved'], default: 'Open' },
    },
    {
        timestamps: true,
    }
);
module.exports = {
    orderSchema,
    Order: mongoose.model("Order", orderSchema)
}
