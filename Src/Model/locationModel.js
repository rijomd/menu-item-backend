const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        status: { type: String }, // active , inactive
    },
    {
        timestamps: true,
    }
);
module.exports = {
    locationSchema,
    locationModel: mongoose.model("Location", locationSchema)
}
