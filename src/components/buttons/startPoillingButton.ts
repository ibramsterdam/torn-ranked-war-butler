import { getDiscordServer } from "../../functions/prisma/discord";
import { generateMessages } from "../functions/status-messages/generateMessages";
import { prisma } from "../../index";

module.exports = {
  developer: false,
  data: { name: "dashboard-start-polling" },
  async execute(interaction: any, client: any) {
    await interaction.reply("Started Polling");
    setTimeout(async () => await interaction.deleteReply(), 5000);

    const guildID = BigInt(interaction.guildId);
    const server: any = await getDiscordServer(prisma, guildID);

    for (const faction of server.factions) {
      await generateMessages(interaction, faction, server, prisma);
    }
  },
};
