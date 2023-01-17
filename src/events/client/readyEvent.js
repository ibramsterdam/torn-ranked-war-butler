require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log("The bot has booted up!");
    client.user.setActivity("TORN");

    if (!process.env.DATABASE_URL) {
      console.log("No server link found");
      return;
    }

    //Connect to the database
  },
};
