const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

// var schema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//     },
//     body: {
//       type: String,
//     },
//     type: {
//       type: Number,
//     },
//     to: {
//       type: String,
//       default: "",
//     },
//     count: {
//       type: Number,
//       default: 0,
//     },
//     imageUrl: {
//       exists: {
//         type: Boolean,
//         default: false,
//       },
//       value: {
//         type: String,
//         default: "",
//       },
//     },
//     customers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "customers",
//       },
//     ],
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   }
// );

var schema = new mongoose.Schema(
  {
    notification:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"notification"
    },
    read:{
      type:Boolean,
      default:false
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

schema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: "all",
});
module.exports = mongoose.model("customernotification", schema);
