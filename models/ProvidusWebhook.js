const mongoose = require('mongoose');

const ProvidusWebhookSchema = new mongoose.Schema({}, { strict: false });
const ProvidusWebhook = mongoose.model('ProvidusWebhook', ProvidusWebhookSchema);

module.exports = ProvidusWebhook;