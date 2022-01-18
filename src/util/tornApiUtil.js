const axios = require('axios');

const getTornRankedWarInfo = async () => {
  return axios.get(
    'https://api.torn.com/torn/?selections=rankedwars&key=qAGrMGvcHWMeXVXE'
  );
};

module.exports = {
  getTornRankedWarInfo,
};
