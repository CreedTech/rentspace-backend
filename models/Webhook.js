const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({}, { strict: false });
const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;