let apiKeyCountMap = new Map();
let totalCount = 0;
const ONE_MINUTE = 60000;
// reset the map
setInterval(async () => {
  apiKeyCountMap.forEach((value, key, map) => {
    totalCount = +totalCount + value;
    console.log(`Calls per Minute from key '${key}' is: ${value}`);
  });
  console.log(`Total Torn calls per minute: ${totalCount}`);
  totalCount = 0;

  apiKeyCountMap.clear();
}, ONE_MINUTE);

function logApiCount(apiKey) {
  if (!apiKeyCountMap.has(apiKey)) apiKeyCountMap.set(apiKey, 0);

  let count = apiKeyCountMap.get(apiKey);
  count++;
  apiKeyCountMap.set(apiKey, count);
}

module.exports = {
  logApiCount,
};
