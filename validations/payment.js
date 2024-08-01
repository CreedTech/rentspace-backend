const z = require("zod");

const PaymentSchema = z.object({
    email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email"),
    amount: z.number(),
    country: z.enum([
        "NG",
    ]),
    currency:z.enum([
        "NGN",
    ]), 
    payment_methods: z.enum(["card", "ussd", "bank-account"]),

}).strict()
const RentFundSchema = z.object({
    interval_amount: z.number(),
    amount: z.number(),
    rentspaceId: z.string({required_error: 'Rentspace Id is required'}),
    date: z.string({ required_error: 'Date is required' }),
    interval: z.string({required_error: 'Interval is required'}),
}).strict()

const PaymentDateSchema = z.object({
    interval: z.string({required_error: 'Interval is required'}),
    date: z.string({required_error: 'Date is required'}),
}).strict()

module.exports = {PaymentSchema,RentFundSchema,PaymentDateSchema}