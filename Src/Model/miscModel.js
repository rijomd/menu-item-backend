const mongoose = require("mongoose");
const { Schema } = mongoose;

const { Location } = require("./locationModel");

const miscSchema = Schema(
    {
        amountLimit: { type: Number, required: true, default: 500 },
        countLimit: { type: Number, required: true, default: 5 },
        multipleCategorySelection: { type: Boolean, default: false },
        location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        orderLimit: { type: Number, required: true, default: 5 },
    },
    {
        timestamps: true,
    }
);

const Misc = mongoose.model("Misc", miscSchema);


module.exports = { miscSchema, Misc }
