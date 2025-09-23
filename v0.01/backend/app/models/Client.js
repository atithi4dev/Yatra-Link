import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // or "bcrypt"

const clientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "Client" },
  },
  { timestamps: true },
);

// hash password before save
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Client", clientSchema);
