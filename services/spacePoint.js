const User = require('../models/User');

const SpacePoints = require('../models/SpacePoints');

exports.createUserSpacePoint = async (user) => {
  let createSpacePoint;
  const spacePoints = await SpacePoints.findOne({ user: user._id });

  if (!spacePoints) {
    createSpacePoint = await SpacePoints.create({
      user: user.id,
    });
  }

  return createSpacePoint;
};

