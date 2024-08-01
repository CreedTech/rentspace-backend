const Referral = require('../models/Referral');

exports.createUserReferralSystem = async (user, referredBy, newReferralCode) => {
  // Create referral document
  const createdReferral = await Referral.create({
    user: user._id,
    referralCode: newReferralCode,
    referredBy,
    referralPoints: 0,
    referrals: 0,
  });

  return createdReferral;
};

