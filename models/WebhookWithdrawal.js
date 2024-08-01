const mongoose = require('mongoose');

const webhookWithdrawalSchema = new mongoose.Schema({}, { strict: false });
const WebhookWithdrawal = mongoose.model('Webhook_withdrawal', webhookWithdrawalSchema);

module.exports = WebhookWithdrawal;