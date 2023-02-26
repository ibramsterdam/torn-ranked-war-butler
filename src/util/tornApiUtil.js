const axios = require("axios");
const { logApiCount } = require("./logApiCount");

const getFactionFromTornApi = async (factionID, apiKey) => {
  logApiCount(apiKey);
  try {
    return axios.get(
      `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
const getUserFromTornApi = async (apiKey) => {
  logApiCount(apiKey);

  try {
    return axios.get(
      `https://api.torn.com/user/?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
const getUserFromTornApiById = async (apiKey, tornId) => {
  logApiCount(apiKey);

  try {
    return axios.get(
      `https://api.torn.com/user/${tornId}?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};

module.exports = {
  getFactionFromTornApi,
  getUserFromTornApi,
  getUserFromTornApiById,
};
