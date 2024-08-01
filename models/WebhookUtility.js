const mongoose = require('mongoose');

const webhookUtilitySchema = new mongoose.Schema({}, { strict: false });
const WebhookUtility = mongoose.model('Webhook_utility', webhookUtilitySchema);

module.exports = WebhookUtility;