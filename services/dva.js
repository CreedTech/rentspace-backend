const User = require("../models/User");

exports.createDVA = async (id, res) => {
    const user = await User.findById(id);

    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }
}