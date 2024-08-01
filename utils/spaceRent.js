
/**
 * Checks if the user has paid 70% or more of the total amount in a SpaceRent instance.
 * @param {Object} spaceRent - The SpaceRent instance object.
 * @returns {boolean} Returns true if paid 70% or more, otherwise false.
 */
const hasPaid70Percent = (spaceRent) => {

    const seventyPercent = spaceRent.amount * 0.7;
  
    return spaceRent.paid_amount >= seventyPercent;
  };
  
  module.exports = { hasPaid70Percent };
  