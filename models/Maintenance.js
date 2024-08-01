const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({

  status:{
    type:String,
    enum: ["active", "inactive",],
    required: true,
    default:'active',
  },
  uniqueField: {
    type: String,
    unique: true,
    default: 'single_maintenance_status', // Set a default unique value
  },
},
{ timestamps: true }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
