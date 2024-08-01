const express = require("express");

const {
  createWallet,
  createPin,
  changePin,
  resetPinOTP,
  verifyResetPinOTP,
  setNewPin,
  fundWallet,
  getUserWallet,
  getAllWallets,
  walletWithdrawal,
  resendPinOTP,
  getWalletHistory,
  getAllWithdrawals,
  getAllDvaPayments,
  getAllWalletHistories,
  getUserWalletHistory,
  userRecentTransfers,
  providusWalletWithdrawal,
  getProvidusTransactionStatus,
  setUserDefaultBank,
  providusToProvidusTransfer,
  getProvidusAccountDetails,
} = require("../../controllers/wallet");
const { isAuthenticated, restrictTo } = require("../../middlewares/auth");
const WalletHistory = require("../../models/WalletHistory");

const rateLimiter = require("../../utils/rate-limiter");

const { Router } = express;

const router = Router();

/**
 * @route POST /api/wallet/create
 * @desc Create wallet
 * @access Private
 */
router.post("/create", isAuthenticated, createWallet);

/**
 * @route POST /api/wallet/create-pin
 * @desc Create PIN
 * @access Private
 */
router.post("/create-pin", isAuthenticated, createPin);

/**
 * @route GET /api/wallet/get-wallet
 * @desc Get user wallet
 * @access Private
 */
router.get("/get-wallet", isAuthenticated, getUserWallet);

/**
 * @route GET /api/wallet/get-wallets
 * @desc Get all users' wallet details
 * @access Private (restricted to super-admin, admin, account)
 */
router.get(
  "/get-wallets",
  isAuthenticated,
  restrictTo("super-admin", "admin", "account"),
  getAllWallets
);

/**
 * @route POST /api/wallet/change-pin
 * @desc Change PIN
 * @access Private
 */
router.post("/change-pin", isAuthenticated, changePin);

/**
 * @route POST /api/wallet/reset-pin
 * @desc Reset PIN
 * @access Private
 */
router.post("/reset-pin", isAuthenticated, resetPinOTP);

/**
 * @route POST /api/wallet/resend-pinOtp
 * @desc Resend PIN OTP
 * @access Private
 */
router.post("/resend-pinOtp", isAuthenticated, resendPinOTP);

/**
 * @route POST /api/wallet/verify-otp
 * @desc Verify OTP for PIN reset
 * @access Private
 */
router.post("/verify-otp", isAuthenticated, verifyResetPinOTP);

/**
 * @route POST /api/wallet/set-pin
 * @desc Set new PIN
 * @access Private
 */
router.post("/set-pin", isAuthenticated, setNewPin);

/**
 * @route POST /api/wallet/fund
 * @desc Fund wallet
 * @access Private
 */
router.post("/fund", isAuthenticated, fundWallet);

/**
 * @route POST /api/wallet/wallet-withdrawal
 * @desc Wallet withdrawal
 * @access Private
 */
router.post("/wallet-withdrawal", isAuthenticated, walletWithdrawal);

/**
 * @route POST /api/wallet/providus-wallet-withdrawal
 * @desc Providus wallet withdrawal
 * @access Private
 */
router.post(
  "/providus-wallet-withdrawal",
  isAuthenticated,
  rateLimiter,
  providusWalletWithdrawal
);

/**
 * @route POST /api/wallet/providus-to-providus-transfer
 * @desc Providus to Providus transfer
 * @access Private
 */
router.post(
  "/providus-to-providus-transfer",
  isAuthenticated,
  rateLimiter,
  providusToProvidusTransfer
);

/**
 * @route POST /api/wallet/providus-query-withdrawal
 * @desc Query Providus withdrawal status
 * @access Private
 */
router.post(
  "/providus-query-withdrawal",
  isAuthenticated,
  getProvidusTransactionStatus
);

/**
 * @route PATCH /api/wallet/set-default-bank
 * @desc Set user default bank
 * @access Private
 */
router.patch("/set-default-bank", isAuthenticated, setUserDefaultBank);

/**
 * @route GET /api/wallet/wallet-histories
 * @desc Get wallet history
 * @access Private
 */
router.get("/wallet-histories", isAuthenticated, getWalletHistory);

/**
 * @route GET /api/wallet/withdrawals
 * @desc Get all withdrawals
 * @access Private
 */
router.get("/withdrawals", isAuthenticated, getAllWithdrawals);

/**
 * @route GET /api/wallet/virtual-payments
 * @desc Get all DVA payments
 * @access Private
 */
router.get("/virtual-payments", isAuthenticated, getAllDvaPayments);

/**
 * @route GET /api/wallet/transactions
 * @desc Get all wallet histories
 * @access Private (restricted to super-admin, admin, account, sales)
 */
router.get(
  "/transactions",
  isAuthenticated,
  restrictTo("super-admin", "admin", "account", "sales"),
  getAllWalletHistories
);

/**
 * @route GET /api/wallet/user-transactions
 * @desc Get user wallet history
 * @access Private (restricted to super-admin, admin, account, sales)
 */
router.get(
  "/user-transactions",
  isAuthenticated,
  restrictTo("super-admin", "admin", "account", "sales"),
  getUserWalletHistory
);

/**
 * @route GET /api/wallet/user-recent-transfers
 * @desc Get user recent transfers
 * @access Private
 */
router.get("/user-recent-transfers", isAuthenticated, userRecentTransfers);

module.exports = router;
