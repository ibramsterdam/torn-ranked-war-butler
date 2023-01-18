const {
  Client,
  Collection,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require("dotenv").config();

client.commands = new Collection();

client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log(`client logged in as ${client.user.username}`);
    client.user.setActivity(
      `Torn with ${client.guilds.cache.size + 1} torn guilds`,
      {
        type: ActivityType.Playing,
      }
    );
  })
  .catch((err) => console.log("Err", err));
