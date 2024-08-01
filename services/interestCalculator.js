function calculateFDPMultiplier(durationInDays) {
  if (durationInDays >= 1 && durationInDays <= 119) {
    return 1.0;
  } else if (durationInDays >= 120 && durationInDays <= 149) {
    return 1.005;
  } else if (durationInDays >= 150 && durationInDays <= 179) {
    return 1.01;
  } else if (durationInDays >= 180 && durationInDays <= 269) {
    return 1.015;
  } else if (durationInDays >= 270 && durationInDays <= 365) {
    return 1.02;
  } else if (durationInDays >= 366 && durationInDays <= 548) {
    return 1.025;
  } else {
    return 0;
  }
}

function calculateSpaceRentInterest(principal, durationInDays) {
  let interestRate;
  if (principal >= 1000.0 && principal <= 49999.0) {
    interestRate = 0.00027;
  } else if (principal >= 50000.0 && principal <= 1000000.0) {
    interestRate = 0.00027;
  } else if (principal >= 1000001.0 && principal <= 2000000.0) {
    interestRate = 0.00027;
  } else if (principal >= 2000001.0 && principal <= 5000000.0) {
    interestRate = 0.00028;
  } else if (principal >= 5000001.0 && principal <= 10000000.0) {
    interestRate = 0.00029;
  } else if (principal >= 10000001.0 && principal <= 20000000.0) {
    interestRate = 0.00029;
  } else if (principal >= 20000001.0 && principal <= 30000000.0) {
    interestRate = 0.0003;
  } else if (principal >= 30000001.0 && principal <= 50000000.0) {
    interestRate = 0.0003;
  } else {
    return 0;
  }


  const fdpMultiplier = calculateFDPMultiplier(durationInDays);
  let interestEarned =
    principal * fdpMultiplier * Math.pow(1 + interestRate, durationInDays) -
    principal;

  interestEarned = Math.floor(interestEarned * 100) / 100;

  console.log(principal, interestRate, interestEarned);

  return interestEarned;
}

function calculateSpaceWalletInterest(principal, durationInDays = 1) {
  const interestRate = 0.00009;
  const fdpMultiplier = 1.0;

  let interestEarned =
    principal * fdpMultiplier * Math.pow(1 + interestRate, durationInDays) -
    principal;

  interestEarned = Math.floor(interestEarned * 100) / 100;

  return interestEarned;  
}

module.exports = {
  calculateSpaceRentInterest,
  calculateSpaceWalletInterest,
};
