const z = require("zod");

const ProvidusAccountSchema = z.object({

    email: z.string({
        required_error: "email is required",
    })
    .email("Invalid email"),


}).strict()

module.exports = {ProvidusAccountSchema}