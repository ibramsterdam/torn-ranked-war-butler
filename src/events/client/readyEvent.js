const { Client } = require("discord.js");
require("dotenv").config();
const mongoose = require("mongoose");

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
    mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client has connected to the database");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
