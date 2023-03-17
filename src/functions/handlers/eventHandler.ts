import * as events from "../../events";

export async function handleEvents(client: any) {
  await client.events.clear();

  for (const event of Object.values(events)) {
    //@ts-ignore
    const execute = (...args: any) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.once) {
      if (event.now) {
        event.execute(client);
      } else {
        client.once(event.name, (...args: any) => event.execute(client));
      }
    } else {
      //@ts-ignore
      client.on(event.name, (...args: any) => event.execute(...args, client));
    }
  }

  console.log("Events Loaded");
}
