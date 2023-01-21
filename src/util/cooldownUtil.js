const cooldowns = new Map();
const { Collection } = require("discord.js");

const checkCooldown = (command, interaction) => {
  //If command has a cooldown set and get timers
  if (!(command.cooldown === undefined)) {
    //If the person who triggered the command does not have values in Map, set it.
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const currentTime = Date.now();
    const timestamp = cooldowns.get(command.name);
    const cooldownTime = command.cooldown * 1000;

    //If command is triggered by member before it has a timestamp
    if (timestamp.has(interaction.member.id)) {
      const expirationTime =
        timestamp.get(interaction.member.id) + cooldownTime;

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;

        interaction.reply(
          `Please wait ${timeLeft.toFixed(
            1
          )} more seconds before using the command /${command.name}`
        );

        return true;
      }
    }

    timestamp.set(interaction.member.id, currentTime);
    setTimeout(() => timestamp.delete(interaction.member.id), cooldownTime);
  }
  return false;
};

module.exports = {
  checkCooldown,
};
