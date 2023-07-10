const crypto = require("crypto");

const generateUid = (max = 8) => {
  return crypto.randomBytes(32).toString("hex").substring(0, max);
};

module.exports = { generateUid };
