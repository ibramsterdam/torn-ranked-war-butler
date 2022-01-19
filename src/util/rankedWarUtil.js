require('dotenv').config();

/**
 * @description Checks the objectlist and returns warinformation your faction is in.
 * @param {List of Objects} rankedWarList
 */
const getMyFactionWarInfo = (rankedWarList) => {
  let warOfFaction = undefined;

  Object.values(rankedWarList).forEach((war) => {
    const warObject = Object.values(war);
    const factionInfo = warObject[Object.keys(warObject)[0]];

    if (factionInfo.hasOwnProperty(process.env.TORN_FACTION_ID)) {
      warOfFaction = warObject;
    }
  });
  return warOfFaction;
};

module.exports = {
  getMyFactionWarInfo,
};
