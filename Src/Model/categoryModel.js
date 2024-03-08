const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        status: { type: String, enum: ['Active', 'InActive'], default: 'Active' }, // Active , InActive
    },
    {
        timestamps: true,
    }
);
module.exports = {
    categorySchema,
    categoryModel: mongoose.model("Category", categorySchema)
}
