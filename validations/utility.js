const z = require("zod");

const ValidateBillSchema = z.object({
    channel: z
    .string({
      required_error: "Channel is required",
    }),
    accountNumber: z
    .string({
      required_error: "Account Number is required",
    }),
}).strict()
const UtilityHistorySchema = z.object({
  amount: z
    .string({
      required_error: "Amount is required",
    }),
    biller: z
    .string({
      required_error: "Biller is required",
    }),
    transactionType: z
    .string({
      required_error: "Transaction Type is required",
    }),
    description: z
    .string({
      required_error: "Description is required",
    }),
}).strict()


module.exports = {
  ValidateBillSchema,
  UtilityHistorySchema
  };
  