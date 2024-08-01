const z = require("zod");

const DVASchema = z.object({

    email: z.string({
        required_error: "email is required",
    })
    .email("Invalid email"),


}).strict()

module.exports = {DVASchema}