const z = require("zod");

const AccountSchema = z
  .object({
    financial_institution: z.string({
      required_error: "Financial institution is required",
    }),
    account_id: z.string({
      required_error: "Account Id is required",
    }),
  })
  .strict();

const WithdrawalAccountSchema = z
  .object({
    bankName: z.string({
      required_error: "Bank name is required",
    }),
    accountNumber: z.string({
      required_error: "Account number is required",
    }),
    accountHolderName: z.string({
      required_error: "Account holder name is required",
    }),
    bankCode: z.string({
      required_error: "Bank code is required",
    }),
  })
  .strict();

module.exports = { AccountSchema, WithdrawalAccountSchema };
