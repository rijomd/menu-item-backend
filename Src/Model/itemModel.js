const mongoose = require("mongoose");
const { Schema } = mongoose;

const { Location } = require("./locationModel");
const { Category } = require("./categoryModel");

const itemSchema = Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        sellingPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        usedQuantity: { type: Number },
        offer: { type: Number },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        status: { type: String, enum: ['Active', 'InActive'], default: 'Active' }
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.model("Item", itemSchema);


module.exports = { itemSchema, Item }
