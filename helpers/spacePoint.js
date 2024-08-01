// Function to calculate space points earned from recharge amount
const calculateSpacePoint = (intervalAmount) => {
  // Calculate 0.5% of the recharge amount in naira
  let spacePoints = 0.0025 * rechargeAmount;

  // Convert the earned amount in naira to space points (1 space point = 2 naira)
  let earnedAmountNaira = spacePoints * 2;
  spacePoints = Math.floor(spacePoints);
  // earnedAmountNaira = Math.floor(earnedAmountNaira);

  return { spacePoints, earnedAmountNaira };
};

// Example: User buys airtime worth 2000 naira
// const rechargeAmount = 400;
// const { spacePoints, earnedAmountNaira } = calculateSpacePoint(rechargeAmount);

// console.log(`User earns ${spacePoints} space points.`);
// console.log(`The equivalent value in naira is ${earnedAmountNaira} naira.`);

// Function to calculate space points earned from recharge amount
const calculateRentSpacePoint = (intervalAmount) => {
  // Calculate 0.8% of the interval amount in naira
  let spacePoints = 0.0008 * intervalAmount;

  // Convert the earned amount in naira to space points (1 space point = 1 naira)
  let earnedAmountNaira = spacePoints * 1;
  spacePoints = Math.floor(spacePoints);

  return { spacePoints, earnedAmountNaira };
};

// Example: User buys airtime worth 2000 naira
const intervalAmount = 400;
// const { spacePoints, earnedAmountNaira } = calculateSpacePoint(intervalAmount);
// const { spacePoints, earnedAmountNaira } = calculateRentSpacePoint(intervalAmount);

// console.log(`User earns ${spacePoints} space points.`);
// console.log(`The equivalent value in naira is ${earnedAmountNaira} naira.`);

const addSpacePointOnUserInflow = (inflowAmount) => {
  let spacePoints = 0.0004 * inflowAmount;
  spacePoints = Math.floor(spacePoints);
  return spacePoints;
}

module.exports = {
  calculateSpacePoint,
  calculateRentSpacePoint,
  addSpacePointOnUserInflow
};
