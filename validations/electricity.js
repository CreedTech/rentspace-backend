const z = require('zod');

const ElectricityBillPaymentSchema = z
  .object({
    phoneNumber: z.string().min(10),
    amount: z.number().min(500),
    meterNumber: z.string().regex(/^\d+$/),
    billingServiceID: z.string(),
    email: z.string(),
  })
  .strict();
const ElectricityVerificationSchema = z
  .object({
    meterNumber: z.string().regex(/^\d+$/),
    billingServiceID: z.string(),
  })
  .strict();

module.exports = {
  ElectricityBillPaymentSchema,
  ElectricityVerificationSchema,
};
