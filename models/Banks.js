const mongoose = require('mongoose');

const banksSchema = new mongoose.Schema({}, { strict: false });
const Banks = mongoose.model('Banks', banksSchema);

module.exports = Banks;