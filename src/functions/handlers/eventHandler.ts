async function handleEvents(client: any) {
  const { loadFiles } = require("../fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Events", "Status");

  await client.events.clear();

  const Files = await loadFiles("events");

  Files.forEach((file: any) => {
    const event = require(file);

    const execute = (...args: any) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.rest) {
      if (event.once)
        client.rest.once(event.name, (...args: any) =>
          event.execute(...args, client)
        );
      else
        client.rest.on(event.name, (...args: any) =>
          event.execute(...args, client)
        );
    } else if (event.custom) event.execute(client);
    else {
      if (event.once)
        client.once(event.name, (...args: any) =>
          event.execute(...args, client)
        );
      else
        client.on(event.name, (...args: any) => event.execute(...args, client));
    }

    table.addRow(event.name, "🟢");
  });

  console.log("Events Loaded");
  return console.log(table.toString());
}

module.exports = { handleEvents };
