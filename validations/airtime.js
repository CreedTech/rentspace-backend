const z = require("zod");

const AirtimeSchema = z.object({
    phoneNumber: z.string().min(11),
    amount: z.number().min(50),
    network: z.string({
        required_error: "Network is Required"
    }),
    biller: z.string({
        required_error: "Biller is Required"
    }),
}).strict()

module.exports = {AirtimeSchema}
