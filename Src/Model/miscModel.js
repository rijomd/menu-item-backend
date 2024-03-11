const mongoose = require("mongoose");
const { Schema } = mongoose;

const { Location } = require("./locationModel");

const miscSchema = Schema(
    {
        amountLimit: { type: Number, required: true },
        countLimit: { type: Number, required: true },
        multipleCategorySelection: { type: Boolean, default: false },
        location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    },
    {
        timestamps: true,
    }
);

const Misc = mongoose.model("Misc", miscSchema);


module.exports = { miscSchema, Misc }
