const express = require('express');

const {
  createUser,
  userLogin,
  resendVerificationOTP,
  resendPasswordOTP,
  updatePassword,
  changePassword,
  getAllUsers,
  getUserDetail,
  getSingleUser,
  updateUserInfo,
  deleteUserByEmail,
  deleteUser,
  userLogout,
  getAllUsersActivities,
  getUserActivity,
  adminHistory,
  getUserFullInfo,
  referrals,
  fetchReferredUsers,
  fetchUserReferralTree,
  postFcmToken,
  createWithdrawalAccount,
} = require('../../controllers/user');
const { isAuthenticated, restrictTo } = require('../../middlewares/auth');
const { cloudinaryConfig } = require('../../services/cloudinaryConfig');
const { upload } = require('../../middlewares/upload');
const { Router } = express;

const router = Router();

/**
 * @route POST api/user/create
 * @description Create user
 * @access Public
 */
router.post('/create', createUser);

/**
 * @route POST api/user/create-withdrawal-account
 * @description Create withdrawal account for user
 * @access Private
 */
router.post(
  '/create-withdrawal-account',
  isAuthenticated,
  createWithdrawalAccount
);

/**
 * @route POST api/user/login
 * @description Login user
 * @access Public
 */
router.post('/login', userLogin);

/**
 * @route POST api/user/postToken
 * @description Post FCM token for user
 * @access Private
 */
router.post('/postToken', isAuthenticated, postFcmToken);

/**
 * @route POST api/user/resend-verification-otp
 * @description Resend Verification OTP
 * @access Public
 */
router.post('/resend-verification-otp', resendVerificationOTP);

/**
 * @route POST api/user/resend-password-otp
 * @description Resend Password OTP
 * @access Public
 */
router.post('/resend-password-otp', resendPasswordOTP);

/**
 * @route PUT api/user/password
 * @description Update user password
 * @access Public
 */
router.put('/password', updatePassword);

/**
 * @route PUT api/user/password/change
 * @description Change user password
 * @access Private
 */
router.put('/password/change', isAuthenticated, changePassword);

/**
 * @route GET api/user/get-users
 * @description Get all users details
 * @access Private (Super Admin or Admin)
 */
router.get(
  '/get-users',
  isAuthenticated,
  restrictTo(
    'user',
    'account',
    'super-admin',
    'admin',
    'marketing',
    'tester',
    'sales'
  ),
  getAllUsers
);

/**
 * @route GET api/user/get-user-profile/:userId
 * @description Get a user's details
 * @access Private (Super Admin or Admin)
 */
router.get(
  '/get-user-profile/:userId',
  isAuthenticated,
  restrictTo('user', 'super-admin', 'admin', 'marketing', 'tester', 'sales'),
  getSingleUser
);

/**
 * @route GET api/user/get-user
 * @description Get current user's details
 * @access Private
 */
router.get('/get-user', isAuthenticated, getUserDetail);

/**
 * @route GET api/user/get-userInfo
 * @description Get current user's full info
 * @access Private
 */
router.get('/get-userInfo', isAuthenticated, getUserFullInfo);

/**
 * @route GET api/user/all-usersActivities
 * @description Get all users activities
 * @access Private (Super Admin or Admin)
 */
router.get(
  '/all-usersActivities',
  isAuthenticated,
  restrictTo('super-admin', 'admin'),
  getAllUsersActivities
);

/**
 * @route GET api/user/userActivities
 * @description Get current user's activity
 * @access Private
 */
router.get('/userActivities', isAuthenticated, getUserActivity);

/**
 * @route POST api/user/update-profile
 * @description Update user's profile info
 * @access Private
 */
router.post(
  '/update-profile',
  isAuthenticated,
  upload.single('image'),
  cloudinaryConfig,
  updateUserInfo
);

/**
 * @route DELETE api/user/delete-user-by-email
 * @description Delete user by email (for testing)
 * @access Private
 */
router.delete('/delete-user-by-email', deleteUserByEmail);

/**
 * @route DELETE api/user/delete-user/:id
 * @description Delete user
 * @access Private
 */
router.delete('/delete-user/:id', isAuthenticated, deleteUser);

/**
 * @route POST api/user/logout
 * @description Logout user
 * @access Private
 */
router.post('/logout', isAuthenticated, userLogout);

/**
 * @route GET api/user/referrals/:userId
 * @description Get referrals for a user
 * @access Private
 */
router.get('/referrals/:userId', isAuthenticated, referrals);

/**
 * @route GET api/user/referredUsers
 * @description Get referred users
 * @access Private
 */
router.get('/referredUsers', isAuthenticated, fetchReferredUsers);

/**
 * @route GET api/user/user-referral-tree
 * @description Get user's referral tree
 * @access Private (Super Admin or Admin)
 */
router.get(
  '/user-referral-tree',
  isAuthenticated,
  restrictTo('super-admin', 'admin', 'marketing', 'tester', 'sales'),
  fetchUserReferralTree
);

/**
 * @route GET api/user/adminHistory
 * @description Get admin history
 * @access Private (Super Admin)
 */
router.get(
  '/adminHistory',
  isAuthenticated,
  restrictTo('super-admin'),
  adminHistory
);

module.exports = router;
