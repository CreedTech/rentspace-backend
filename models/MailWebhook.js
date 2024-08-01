const mongoose = require('mongoose');

const mailWebhookSchema = new mongoose.Schema({}, { strict: false });
const MailWebhook = mongoose.model('MailWebhook', mailWebhookSchema);

module.exports = MailWebhook;