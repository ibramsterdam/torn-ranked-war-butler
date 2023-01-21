const { readdirSync } = require("fs");
const ascii = require("ascii-table");

async function handleComponent(client) {
  const table = new ascii().setHeading("Components ", "Status");
  const componentFolders = readdirSync(`./src/components`);

  for (const folder of componentFolders) {
    const componentFiles = readdirSync(`./src/components/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    const { buttons } = client;

    if (folder === "buttons") {
      for (const file of componentFiles) {
        const button = require(`../../components/${folder}/${file}`);
        buttons.set(button.data.name, button);
        table.addRow(button.data.name, "🟢");
      }
    }
  }
  console.log("Components Loaded");
  return console.log(table.toString());
}

module.exports = { handleComponent };
