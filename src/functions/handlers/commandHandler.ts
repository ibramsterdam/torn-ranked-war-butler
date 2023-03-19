import { Client, Collection } from "discord.js";
import * as botCommands from "../../commands";

export async function handleCommands(
  client: Record<"commands", Collection<unknown, unknown>> & Client
) {
  await client.commands.clear();
  let commandsArray: any = [];

  for (const command of Object.values(botCommands)) {
    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
  }

  if (client.application) client.application.commands.set(commandsArray);

  console.log("Commands Loaded");
}
