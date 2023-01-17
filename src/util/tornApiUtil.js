const axios = require("axios");
require("dotenv").config();

const getTornRankedWarInfo = async () => {
  return axios.get(
    `https://api.torn.com/torn/?selections=rankedwars&key=${process.env.TORN_API_KEY}`
  );
};

const getFaction = async (factionID) => {
  return axios.get(
    `https://api.torn.com/faction/${factionID}?selections=&key=${process.env.TORN_API_KEY}`
  );
};

module.exports = {
  getTornRankedWarInfo,
  getFaction,
};
