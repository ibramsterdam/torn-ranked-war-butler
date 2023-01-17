require("dotenv").config();

/**
 * @description Checks the objectlist and returns warinformation your faction is in.
 * @param {List of Objects} rankedWarList
 */
const getMyFactionWarInfo = (rankedWarList, targetFactionId) => {
  let warOfFaction = undefined;

  Object.values(rankedWarList).forEach((war) => {
    const warObject = Object.values(war);
    const factionInfo = warObject[Object.keys(warObject)[0]];
    if (
      // eslint-disable-next-line no-prototype-builtins
      factionInfo.hasOwnProperty(
        targetFactionId !== null ? targetFactionId : process.env.TORN_FACTION_ID
      )
    ) {
      warOfFaction = warObject;
    }
  });
  return warOfFaction;
};

module.exports = {
  getMyFactionWarInfo,
};
