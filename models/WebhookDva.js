const mongoose = require('mongoose');

const webhookDVASchema = new mongoose.Schema({}, { strict: false });
const WebhookDVA = mongoose.model('Webhook_dva', webhookDVASchema);

module.exports = WebhookDVA;