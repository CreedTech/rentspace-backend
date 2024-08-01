const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({

  title:{
    type:String,
  },
  description:{
    type:String,
  },
  // uniqueField: {
  //   type: String,
  //   unique: true,
  //   default: 'single_announcement_status', // Set a default unique value
  // },
},
{ timestamps: true },
);

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
