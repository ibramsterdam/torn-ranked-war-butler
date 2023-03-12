import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder,
  ChannelType,
} from "discord.js";
import { getDashboardButtons } from "../components/functions/getDashboardButtons";
import {
  getDiscordServer,
  createDiscordServer,
} from "../functions/prisma/discord";
import { createDiscordCategory } from "../functions/prisma/discordCategory";
import { createDiscordChannel } from "../functions/prisma/discordChannel";
import { prisma } from "../index";

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create the space for the butler to work in"),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction: any, client: any) {
    await interaction.deferReply();
    const guildID = BigInt(interaction.guildId);

    let server: any = await getDiscordServer(prisma, guildID);
    if (server) {
      return interaction.followUp(
        `You have already setup the butler in the past and no longer can use this command. Please contact the developer if you want to setup the butler once more`
      );
    }

    // create in discord
    server = await createDiscordServer(prisma, guildID, interaction.guild.name);
    const category = await interaction.guild.channels.create({
      name: "Ranked War Butler",
      type: ChannelType.GuildCategory,
    });
    const channel = await interaction.guild.channels.create({
      name: "butler-dashboard",
      type: ChannelType.GuildText,
      parent: category.id,
    });

    // create in db
    await createDiscordCategory(prisma, category.id, category.name, server.id);
    await createDiscordChannel(
      prisma,
      channel.id,
      channel.name,
      category.id,
      server.id
    );

    const embeds = new EmbedBuilder()
      .setTitle("Ranked War Butler")
      .setDescription(
        "Welcome to the dashboard! From here you can manage which factions you would like to track."
      )
      .addFields(
        {
          name: "General information",
          value: `
        **Whitelist status:** ${server.isWhitelisted ? "🟢" : "🔴"}
        **ApiKey status:** ${server.apiKeys.length}/${server.apiKeyAmount}
        **Faction tracking status:** ${server.factions.length}/${
            server.factionAmount
          }
        `,
        },
        {
          name: "Other information",
          value: `
        1. Buttons enable when you are whitelisted.
        2. Whitelisting happends when payment is made to the developer
        3. If any problems arise, please reach out to the developer
        4. How many apikeys and factions can be connected depends on the deal you made with the developer
        `,
        }
      )
      .setColor("#00b0f4")
      .setFooter({
        text: "Good luck on warring!",
      })
      .setTimestamp();
    const buttons = await getDashboardButtons(
      "noMenuType",
      !server.isWhitelisted,
      server.apiKeys.length === 0,
      server.factions.length === 0
    );

    //Reply to the discord client
    await channel.send({
      embeds: [embeds],
      components: [buttons],
    });

    return interaction.followUp("Setup Successfull");
  },
};
