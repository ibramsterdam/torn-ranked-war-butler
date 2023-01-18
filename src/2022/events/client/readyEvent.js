require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log("The bot has booted up!");
    client.user.setActivity("Torn");

    if (!process.env.DATABASE_URL) {
      console.log("No db url link found");
    }
  },
};
