const axios = require("axios");
require("dotenv").config();

const getFactionFromTornApi = async (factionID, apiKey) => {
  try {
    return axios.get(
      `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
const getUserFromTornApi = async (apiKey) => {
  try {
    return axios.get(
      `https://api.torn.com/user/?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};

module.exports = {
  getFactionFromTornApi,
  getUserFromTornApi,
};
