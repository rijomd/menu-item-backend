const mongoose = require("mongoose");
const { Schema } = mongoose;

const { User } = require("./userModel");
const { Location } = require("./locationModel");

const billSchema = Schema(
    {
        closedOn: { type: Date },
        location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
        document: { type: String, required: true },
        closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);
module.exports = {
    billSchema,
    Bill: mongoose.model("Bill", billSchema)
}
