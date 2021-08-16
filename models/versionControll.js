const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    version: {
      type: String,
      default: "",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    active:{
        type:Boolean,
        default:false
    },
    activatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },
    deActivatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },
    activeDate: {
      type: Date
    },
    deactiveDate: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
module.exports = mongoose.model("version", schema);
