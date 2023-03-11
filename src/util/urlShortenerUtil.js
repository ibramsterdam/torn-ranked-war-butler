const axios = require("axios");
const getShortUrlAttackLink = async (tornId) => {
  try {
    return axios.post(`https://xa.up.railway.app/api/generate`, {
      url: `https://www.torn.com/loader.php?sid=attack&user2ID=${tornId}`,
    });
  } catch (error) {
    return "error";
  }
};
const getShortUrlProfileLink = async (tornId) => {
  try {
    return axios.post(`https://xa.up.railway.app/api/generate`, {
      url: `https://www.torn.com/profiles.php?XID=${tornId}`,
    });
  } catch (error) {
    return "error";
  }
};
module.exports = { getShortUrlAttackLink, getShortUrlProfileLink };
