const { Events } = require('../validation/eventNames');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

module.exports = async (client) => {
  const table = new Ascii('Events loaded');

  //Make map out of all files in events folder and loop over them.
  (await PG(`${process.cwd()}/src/events/*/*.js`)).map(async (eventFile) => {
    const event = require(eventFile);

    //If event is invalid or missing
    if (!Events.includes(event.name) || !event.name) {
      const arg = eventFile.split('/');

      //If event is invalid add Sucessfull Row
      await table.addRow(
        `${event.name || 'MISSING'}`,
        `⛔ Event name is invalid or missing: ${arg[6] + `/` + arg[7]}`
      );
      return; //prevent bot crash
    }

    //If event is valid execure
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    //If event is valid add Sucessfull Row
    await table.addRow(event.name, '✅ Succesfull');
  });

  console.log(table.toString());
};
