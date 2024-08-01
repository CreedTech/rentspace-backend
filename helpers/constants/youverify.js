const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // in milliseconds
const YOUVERIFY_TOKEN = process.env.YOUVERIFY_LIVE_TOKEN;
const YOUVERIFY_TEST_API_URL = "https://api.sandbox.youverify.co/v2/api/identity/ng/bvn";
const YOUVERIFY_LIVE_API_URL = "https://api.youverify.co/v2/api/identity/ng/bvn";

module.exports = {
  MAX_RETRIES,
  RETRY_DELAY,
  YOUVERIFY_TOKEN,
  YOUVERIFY_TEST_API_URL,
  YOUVERIFY_LIVE_API_URL
};
