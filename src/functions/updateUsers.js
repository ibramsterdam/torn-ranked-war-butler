const { getRandomItemFromArray } = require("../util/randomItemFromArray");
const { getUserFromTornApiById } = require("../util/tornApiUtil");
const { getBrainSurgeonApiKeys } = require("./prisma/apiKey");
const { getAllUsers, updateUserPersonalStats } = require("./prisma/user");

const updateUsers = async () => {
  const startTime = performance.now();
  const prisma = require("../index");

  const keys = await getBrainSurgeonApiKeys(prisma);

  const users = await getAllUsers(prisma);
  let index = 0;
  for (const user of users) {
    if (index % 50 === 0)
      console.log(`Updated ${index} / ${users.length} users`);
    const randomApiKeyObject = getRandomItemFromArray(keys);

    const latestUserInfo = await getUserFromTornApiById(
      randomApiKeyObject.value,
      user.id
    );
    console.log(latestUserInfo.data);

    await updateUserPersonalStats(
      prisma,
      user.id,
      latestUserInfo.data.personalstats,
      latestUserInfo.data.age,
      latestUserInfo.data.revivable
    );
    await delay(2000);
    index++;
  }

  const endTime = performance.now();
  const time = Math.floor((endTime - startTime) / 1000);
  console.log(`Updating users took: ${time} seconds.`);
  updateUsers();
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = { updateUsers };
