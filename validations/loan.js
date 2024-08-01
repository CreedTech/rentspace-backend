const { z } = require("zod");

const LoanApplicationSchema = z.object({
  spaceRent: z.string().min(1, "Space Rent ID is required"),
  reason: z.string().min(1, "Reason for loan application is required"),
  personalID: z.object({
    type: z.enum(
      ["Passport", "Voter ID", "Driver License", "NIN"],
      "Invalid ID type"
    ),
    idNumber: z.string().min(1, "ID number is required"),
  }),
  landlordOrAgent: z.object({
    name: z.string().min(1, "Landlord or agent name is required"),
    livesInSameProperty: z.boolean().refine(val => val !== undefined, "Landlord or agent living status is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z
      .string()
      .min(1, "Landlord or agent phone number is required"),
    // duration: z.string().min(1, "Duration is required"),
    propertyType: z.enum(
      ["Residential", "Commercial"],
      "Invalid property type"
    ),
    accountNumber: z.string().min(1, "Landlord or agent account number is required"),
    bankName: z.string().min(1, "Landlord or agent bank name is required"),
  }),
  occupation: z.object({
    status: z.enum(["Employed", "Self-Employed"], "Invalid occupation status"),
    details: z
      .object({
        position: z.string().optional(),
        netSalary: z.number().optional(),
        businessName: z.string().optional(),
        cacNumber: z.string().optional(),
        estimatedMonthlyTurnover: z.number().optional(),
        estimatedNetMonthlyProfit: z.number().optional(),
      })
      .refine(
        (data) => {
          if (
            (data.status === "Employed" &&
              (!data.position || data.netSalary == null)) ||
            (data.status === "Self-Employed" &&
              (!data.businessName ||
                !data.cacNumber ||
                data.estimatedMonthlyTurnover == null ||
                data.estimatedNetMonthlyProfit == null))
          ) {
            return false;
          }
          return true;
        },
        {
          message:
            "Please provide all required fields for the selected occupation status",
          path: ["occupation"],
        }
      ),
  }),
  guarantor: z.object({
    name: z.string().min(1, "Guarantor name is required"),
    relationship: z.string().min(1, "Guarantor relationship is required"),
    phoneNumber: z.string().min(1, "Guarantor phone number is required"),
    address: z.string().min(1, "Guarantor address is required"),
  }),
});

module.exports = LoanApplicationSchema;
