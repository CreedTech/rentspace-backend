const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { unAuthenticated } = require("../helpers/error");
const BlacklistToken = require("../models/Logout");
const FCMToken = require("../models/FCMToken");


// const isAuthenticated = async (req, res, next) => {
//   // Check if token exists
//   let token;
//   if (
//     req.headers["authorization"] &&
//     req.headers["authorization"].split(" ")[0] === "Bearer"
//   ) {
//     token = req.headers["authorization"].split(" ")[1];
//   }

//   try {
//     if (!token) {
//       return unAuthenticated(res, "You need to login first." );
//     }
//     // Verify token
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
//     req.user = decoded.user;

//     // Check if the token is blacklisted
//     const isBlacklisted = await BlacklistToken.exists({token});
//     // console.log("BLACKLISTED TOKEN=>", isBlacklisted);
    
//     if (isBlacklisted) {
//       return res.status(401).json({
//         error: "You logged-out; Please log in again.",
//       });
//     }
//     req.user = decoded.user;
//   res.locals.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(500).json( error );
//   }
// };

const isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : null;

  if (!token) {
    return unAuthenticated(res, "You need to login first.");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    console.log("DECODED=>", decoded.user);


    const user = await User.findById(decoded.user.id);

    console.log("USER=>", user);
    const storedToken = await FCMToken.findOne({ user: user._id });
    
    if (!user || !storedToken || storedToken.token !== decoded.user.deviceToken) {
      return res.status(401).json({ error: "Invalid token or device" });
    }
    
    const isBlacklisted = await BlacklistToken.exists({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        error: "You logged-out; Please log in again.",
      });
    }
    
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Invalid token" });
  }
};


const restrictTo = (...roles) => async (req, res, next) => {
  console.log('restriction');
  console.log(req.user);
  const currentUser = await User.findById(req.user.id);
  console.log('current user');
  console.log(currentUser);
  try {

    if (!roles.includes(currentUser.role)) {
      return res.status(403).json({
          error: "You do not have permision to perform this action.",
        })
    
    }
    next();
  } catch (error) {
    res.status(500).json( error );
  }

  // const logAdminHistory = (..)
}


module.exports = {
  isAuthenticated,
  restrictTo,
};
