import { Client, TextChannel } from "discord.js";
import { prisma } from "..";
import { getDiscordServer } from "../functions/prisma/discord";
import * as dotenv from "dotenv";
import { getConnectedFactionsOnDiscordServer } from "../functions/prisma/factionsOnDiscordServer";
import { generateMessages } from "../components/functions/status-messages/generateMessages";
dotenv.config();

export async function execute(client: Client) {
  client.on("ready", async () => {
    if (process.env.IS_PROD === "true") {
      client.guilds.cache.forEach(async (guild) => {
        const trackedChannels = await getConnectedFactionsOnDiscordServer(
          prisma,
          BigInt(guild.id)
        );
        const server = await getDiscordServer(prisma, BigInt(guild.id));

        if (trackedChannels) {
          for (const trackedChannel of trackedChannels) {
            guild.channels.cache.forEach(async (channel) => {
              if (trackedChannel.discordChannelId.toString() === channel.id) {
                if (channel instanceof TextChannel && trackedChannel.faction) {
                  if (server && server.apiKeys.length > 0) {
                    generateMessages(
                      channel,
                      trackedChannel.faction.id,
                      server,
                      prisma
                    );
                  }
                }
              }
            });
          }
        }
      });
    }
  });
}

export const name = "send-messages";
export const once = true;
export const now = true;
