// @ts-nocheck
//TODO investigate this file

const { readdirSync } = require("fs");
const ascii = require("ascii-table");

export async function handleComponent(client) {
  const table = new ascii().setHeading("Components ", "Type", "Status");
  const componentFolders = readdirSync(`./src/components`);

  for (const folder of componentFolders) {
    const componentFiles = readdirSync(`./src/components/${folder}`).filter(
      (file) => file.endsWith(".ts")
    );

    const { buttons, modals, selectMenus } = client;

    if (folder === "buttons") {
      for (const file of componentFiles) {
        const button = require(`../../components/${folder}/${file}`);
        buttons.set(button.data.name, button);
        table.addRow(button.data.name, "Button", "🟢");
      }
    }
    if (folder === "selectMenus") {
      for (const file of componentFiles) {
        const menu = require(`../../components/${folder}/${file}`);
        selectMenus.set(menu.data.name, menu);
        table.addRow(menu.data.name, "Menu", "🟢");
      }
    }
    if (folder === "modals") {
      for (const file of componentFiles) {
        const modal = require(`../../components/${folder}/${file}`);
        modals.set(modal.data.name, modal);
        table.addRow(modal.data.name, "Modal", "🟢");
      }
    }
  }
  console.log("Components Loaded");
  return console.log(table.toString());
}
