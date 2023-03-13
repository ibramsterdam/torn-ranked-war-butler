import * as events from "../../events";

export async function handleEvents(client: any) {
  await client.events.clear();

  for (const event of Object.values(events)) {
    const execute = (...args: any) => event.execute([...args], client);
    client.events.set(event.name, execute);

    if (event.once) {
      client.once(event.name, (...args: any) => event.execute(client));
    } else
      client.on(event.name, (...args: any) => event.execute([...args], client));
  }

  console.log("Events Loaded");
}
