const axios = require('axios');
require('dotenv').config();

const getTornRankedWarInfo = async () => {
  return axios.get(
    `https://api.torn.com/torn/?selections=rankedwars&key=${process.env.TORN_API_KEY}`
  );
};

const getFaction = async (factionID) => {
  const pattern = new RegExp('^([0-9]*$)');
  return pattern.test(factionID)
    ? axios.get(
        `https://api.torn.com/faction/${factionID}?selections=&key=${process.env.TORN_API_KEY}`
      )
    : undefined;
};

module.exports = {
  getTornRankedWarInfo,
  getFaction,
};
