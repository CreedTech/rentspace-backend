const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ActivitiesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    activityType:{type:String,},
    description: {
        type: String,
        required:true,
    },
    activityDate: {
        type: Date,
        default: Date.now,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Activities", ActivitiesSchema);