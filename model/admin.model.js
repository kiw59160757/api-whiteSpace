const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      default: "",
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// AdminSchema.index({ firstName: 1, lastName: 1 },{ unique:true })
AdminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    // eslint-disable-next-line no-invalid-this
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // eslint-disable-next-line no-invalid-this
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

AdminSchema.plugin(mongoosePaginate);



var Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
