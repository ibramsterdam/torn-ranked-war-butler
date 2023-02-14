const { Client } = require("discord.js");
const { getAllApiKeys } = require("../../functions/prisma/apiKey");
const { getAllFactions } = require("../../functions/prisma/faction");
const { getRandomItemFromArray } = require("../../util/randomItemFromArray");
const { getFactionFromTornApi } = require("../../util/tornApiUtil");
require("dotenv").config();

module.exports = {
  name: "update-database",
  custom: true,
  /**
   *  @param {Client} client
   */
  async execute(client) {
    // const prisma = require("../../index");
    // const apiKeys = await getAllApiKeys(prisma);
    // const factions = await getAllFactions(prisma);
    // for (const faction of factions) {
    //   const randomApiKeyObject = getRandomItemFromArray(apiKeys);
    // }
  },
};
