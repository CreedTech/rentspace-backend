const z = require('zod');

const CableBillPaymentSchema = z
  .object({
    phoneNumber: z.string().min(10),
    amount: z.number().min(500),
    smartCardNumber: z.string().regex(/^\d+$/),
    productCode: z.string(),
    invoicePeriod: z.string(),
    billingServiceID: z.string(),
  })
  .strict();
const CableVerificationSchema = z
  .object({
    smartCardNumber: z.string().regex(/^\d+$/),
    billingServiceID: z.string(),
  })
  .strict();
const CableSchema = z
  .object({
    billingServiceID: z.string(),
  })
  .strict();

module.exports = {
  CableBillPaymentSchema,
  CableVerificationSchema,
  CableSchema,
};
