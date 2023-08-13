import { ActivityType } from "discord.js";
import { handleCommands } from "../functions/handlers/commandHandler";
import { nowQuery } from "../util/spyreport";

export async function execute(client: any) {
  client.user.setActivity(
    `Torn with ${client.guilds.cache.size + 1} torn guilds`,
    {
      type: ActivityType.Playing,
    }
  );

  handleCommands(client).then(() => {
    console.log("\nThe bot has booted up!");
    // nowQuery();
  });
}

export const name = "ready";
export const once = true;
export const now = false;
