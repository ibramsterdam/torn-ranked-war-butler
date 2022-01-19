const { CommandInteraction, MessageEmbed } = require('discord.js');
module.exports = {
  name: 'clearmessage',
  description:
    'Deletes a specified number of messages from channel or a target.',
  permission: 'ADMINISTRATOR',
  options: [
    {
      name: 'amount',
      description:
        'Select the amount of messages to delete from a channel or a target.',
      type: 'NUMBER',
      required: true,
    },
    {
      name: 'target',
      description: 'Select a target to clear their messages.',
      type: 'USER',
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getNumber('amount');
    const target = options.getMember('target');
    const messages = await channel.messages.fetch();
    const response = new MessageEmbed().setColor('AQUA');

    //no target = null
    if (target) {
      let i = 0;
      const filtered = [];
      (await messages).filter((message) => {
        if (message.author.id == target.id && amount > 0) {
          filtered.push(message);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        response.setDescription(`👌 Cleared ${messages.size} from ${target}.`);
        interaction.reply({ embeds: [response] });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        response.setDescription(
          `👌 Cleared ${messages.size} from this channel.`
        );
        interaction.reply({ embeds: [response] });
      });
    }
  },
};
