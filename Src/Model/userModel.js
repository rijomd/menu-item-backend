const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", },
    userRole: { type: String }, //admin , user ,superAdmin
    status: { type: String }, // Active , InActive
  },
  {
    timestamps: true,
  }
);
module.exports = {
  userSchema,
  UserModel: mongoose.model("User", userSchema)
}
