export async function handleCommands(client: any) {
  const { loadFiles } = require("../fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Status");

  await client.commands.clear();

  let commandsArray: any = [];

  const Files = await loadFiles("commands");

  Files.forEach((file: any) => {
    const command = require(file);
    client.commands.set(command.data.name, command);

    commandsArray.push(command.data.toJSON());

    table.addRow(command.data.name, "🟢");
  });

  client.application.commands.set(commandsArray);

  console.log("Commands Loaded");
  console.log(table.toString());
}
