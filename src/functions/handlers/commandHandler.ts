import * as botCommands from "../../commands";

export async function handleCommands(client: any) {
  await client.commands.clear();
  let commandsArray: any = [];

  for (const command of Object.values(botCommands)) {
    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
  }

  client.application.commands.set(commandsArray);

  console.log("Commands Loaded");
}
