const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String }, //admin , user
    status: { type: String }, // active , inactive
  },
  {
    timestamps: true,
  }
);
module.exports = {
  userSchema,
  UserModel: mongoose.model("User", userSchema)
}
