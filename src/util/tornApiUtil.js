const axios = require("axios");
require("dotenv").config();

const getTornRankedWarInfo = async () => {
  return axios.get(
    `https://api.torn.com/torn/?selections=rankedwars&key=${process.env.TORN_API_KEY}`
  );
};

const getFaction = async (factionID, apiKey) => {
  console.log(
    `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
  );
  try {
    return axios.get(
      `https://api.torn.com/faction/${factionID}?selections=&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};
const getUser = async (apiKey) => {
  try {
    return axios.get(
      `https://api.torn.com/user/?selections=basic,bazaar,crimes,discord,display,personalstats,profile&key=${apiKey}`
    );
  } catch (error) {
    return "error";
  }
};

module.exports = {
  getTornRankedWarInfo,
  getFaction,
  getUser,
};
