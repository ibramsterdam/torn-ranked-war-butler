require('dotenv').config();
const fs = require('fs');

const saveEnemyFaction = (factionID) => {
  const obj = {
    match: [],
  };

  obj.match.push({
    own_faction: process.env.TORN_FACTION_ID,
    enemy_faction: factionID,
  });

  fs.writeFile('match.json', JSON.stringify(obj), function (err) {
    if (err) throw err;
    console.log('complete');
  });
};

module.exports = {
  saveEnemyFaction,
};
