const z = require('zod');

const SpaceRentSchema = z
  .object({
    date: z.string({
      required_error: 'Date is required',
    }),
    rentName: z.string({
      required_error: 'Rent Name is required',
    }),
    due_date: z.string({
      required_error: 'Due Date is required',
    }),
    duration: z.enum(['5', '6', '7', '8']),
    interval: z.enum(['Weekly', 'Monthly']),
    interval_amount: z.number(),
    amount: z.number(),
    payment_count: z.string({
      required_error: 'Number of payments is required',
    }),
    // payment_type:  z
    // .enum([
    //   "DVA Wallet",
    //   "Debit Card",
    // ]),
  })
  .strict();

module.exports = { SpaceRentSchema };
