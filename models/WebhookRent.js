const mongoose = require('mongoose');

const webhookRentSchema = new mongoose.Schema({}, { strict: false });
const WebhookRent = mongoose.model('Webhook_rent', webhookRentSchema);

module.exports = WebhookRent;