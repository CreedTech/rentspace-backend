const mongoose = require('mongoose');

const webhookWalletSchema = new mongoose.Schema({}, { strict: false });
const WebhookWallet = mongoose.model('Webhook_wallet', webhookWalletSchema);

module.exports = WebhookWallet;