const z = require("zod");

const WalletSchema = z
  .object({
    pin: z
      .string({
        required_error: "pin is required",
      })
      .min(4, "pin must be 4 charcters long")
      .max(4, "pin cannot be more than 4 characters long"),
  })
  .strict();

const WalletTransactionSchema = z
  .object({
    amount: z.number().positive(),
    transactionType: z.enum(["credit", "debit"]),
    narration: z.string().min(5).max(255),
  })
  .strict();

const ChangePinSchema = z
  .object({
    currentPin: z.string().min(4).max(4),
    newPin: z.string().min(4).max(4),
  })
  .strict();

const ResetPinSchema = z
  .object({
    // otp: z.string().min(4).max(4),
  })
  .strict();

const VerifyOtpPinSchema = z
  .object({
    otp: z.string().min(4).max(4),
  })
  .strict();

const SetPinSchema = z
  .object({
    newPin: z.string().min(4).max(4),
    confirmNewPin: z.string().min(4).max(4),
  })
  .strict();

const FundWalletSchema = z
  .object({
    amount: z.string(),
  })
  .strict();

  const WalletWithdrawalSchema = z.object({
    bank_code: z
    .string({
      required_error: "Bank Code is required",
    }),
    amount: z.number(),
    pin: z.string().min(4).max(4),
    accountNumber: z
    .string({
      required_error: "Account Number is required",
    }),
}).strict()

const ProvidusWithdrawalSchema = z.object({
  beneficiaryAccountName: z.string(),
  transactionAmount: z.string(),
  currencyCode: z.string(),
  narration: z.string(),
  sourceAccountName: z.string(),
  beneficiaryAccountNumber: z.string(),
  beneficiaryBank: z.string(),
  pin: z.string(),
}).strict();


const ProvidusTransferSchema = z.object({
  creditAccount: z.string(),
  creditAccountName: z.string(),
  debitAccount: z.string(),
  transactionAmount: z.string(),
  currencyCode: z.string(),
  narration: z.string(), 
  beneficiaryBank: z.string(),
  pin: z.string(),
}).strict();



module.exports = {
  WalletSchema,
  FundWalletSchema,
  WalletTransactionSchema,
  ResetPinSchema,
  ChangePinSchema,
  VerifyOtpPinSchema,
  SetPinSchema,
  WalletWithdrawalSchema,
  ProvidusWithdrawalSchema,
  ProvidusTransferSchema
};
