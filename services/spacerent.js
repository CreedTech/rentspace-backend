const { getRentspaceId } = require("../helpers/token");
const SpaceRent = require("../models/SpaceRent");
const User = require("../models/User");

exports.createUserSpaceRent = async (id, res) => {
    const user = await User.findById(id);


    const number = getRentspaceId(20);

    const checkSpaceRentId = await SpaceRent.findOne({ rentspace_id: number });
    
    if (checkSpaceRentId) {
      return getRentspaceId(20);
    }
    

};