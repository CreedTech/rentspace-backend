const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const Wallet = require("../models/Wallet");
const crypto = require('crypto');
var CryptoJS = require("crypto-js");

// only number
const generateOTP = (length = 4) => {
  const otp = otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

// const generateToken = (id, email, expiresIn = "2d") => {
//   const payload = {
//     user: { id, email: email },
//   };
//   const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
//     expiresIn,
//   });
//   return token;
// };

const generateToken = (id, email, deviceToken, expiresIn = "2d") => {
  const payload = {
    user: { id, email, deviceToken },
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
    expiresIn,
  });
  return token;
};



const generateRefreshToken = (id, expiresIn = "10d") => {
  const payload = { user: id };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn,
  });
  return token;
};

const resetPasswordToken = (id, expiresIn = "2m") => {
  const payload = {
    user: { id },
  };
  const token = jwt.sign(payload, process.env.RESET_PASSWORD, {
    expiresIn,
  });
  return token;
};

const decodeToken = (token, secret) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, secret);
    return { user: decoded.user };
  } catch (error) {
    return { error };
  }
};

const generateWalletNumber = () => {
  const number = generateRandomNumber();

  // const checkWalletNumber = await Wallet.findOne({ walletId: number });
  // Call the same function if the barcode exists already
  // if (checkWalletNumber) {
    // return generateWalletNumber();
  // }

  // Otherwise, it's valid and can be used
  return number;
};



const generateRandomNumber = () => {
  return Math.floor(Math.random() * (9999999999 - 1000000000 + 1) + 1000000000);;
};
// const walletNumber = generateWalletNumber();

// console.log(walletNumber);


const getRandom = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(crypto.randomInt(0, chars.length))).join('');
};
const getRentspaceId = (length) => {
  const chars = '0123456789';
  return Array.from({ length }, () => chars.charAt(crypto.randomInt(0, chars.length))).join('');
};
const randomString = getRandom(10);
console.log(randomString);



/**
 * Generates a unique request ID.
 * @param {number} length - The length of the generated ID.
 * @returns {string} - A unique request ID.
 */
function generateRequestId(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}


//  let data= "data to encrypt";
//  let iv="a559c833fca4f9fb";
//  let key="b434faeb3b8492bb00fc87aa178d3d06"
//  let encrypted = CryptoJS.AES.encrypt("418302", CryptoJS.enc.Utf8.parse(key), {iv: 
//    CryptoJS.enc.Utf8.parse(iv)
//  });
// console.log('cipher');
// console.log(CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
// return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

module.exports = {
  generateOTP,
  generateToken,
  decodeToken,
  generateRefreshToken,
  resetPasswordToken,
  generateRandomNumber,
  generateWalletNumber,
  getRandom,
  getRentspaceId,
  generateRequestId
};
