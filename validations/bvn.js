const z = require("zod");

const BVNSchema = z.object({
    bvn: z
    .string({
      required_error: "BVN is required",
    }).min(11, "BVN can not be less than 11 digits")
    .max(11, "BVN can not be more than 11 digits"),
    email: z
    .string({
      required_error: "email address is required",
    })
    .email("invalid email address"),

}).strict()

module.exports = {BVNSchema}