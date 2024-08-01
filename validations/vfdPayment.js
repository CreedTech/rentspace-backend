const z = require("zod");

const VFDBillPaymentSchema = z
  .object({
    customerId: z.string().nonempty(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
    division: z.string().length(1),
    paymentItem: z.string(),
    productId: z.string(),
    billerId: z.string(),
  })
  .strict();

module.exports = { VFDBillPaymentSchema };
