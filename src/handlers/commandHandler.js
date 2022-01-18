const { Perms } = require('../validation/commandPermissions');
const { Client } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');
require('dotenv').config();

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  const table = new Ascii('Commands loaded');

  CommandsArray = [];

  //Make map out of all files in commands folder and loop over them.
  (await PG(`${process.cwd()}/src/commands/*.js`)).map(async (commandFile) => {
    const command = require(commandFile);

    //If command name is missing
    if (!command.name) {
      return table.addRow(file.split('/')[7], '⛔ Failed', 'Missing a name.');
    }

    //If command description is missing
    if (!command.description) {
      return table.addRow(command.name, '⛔ Failed', 'Missing a description.');
    }

    //If command has permission then...
    if (command.permission) {
      if (Perms.includes(command.permission)) {
        command.defaultPermission = false;
      } else {
        return table.addRow(command.name, '⛔ Failed', 'Permission is invalid');
      }
    }

    //Set and push new commands
    client.commands.set(command.name, command);
    CommandsArray.push(command);

    //If everything is valid, add Sucessfull Row
    await table.addRow(command.name, '✅ Succesfull');
  });

  console.log(table.toString());

  //Here we will check the permissions
  client.on('ready', async () => {
    //Find server properties
    const MainGuild = await client.guilds.cache.get(process.env.GUILD_ID);

    //for every command in CommandsArray set permissions who can execute command based on role
    MainGuild.commands.set(CommandsArray).then(async (command) => {
      const roles = (commandName) => {
        const cmdPerms = CommandsArray.find(
          (commandInArray) => commandInArray.name === commandName
        ).permission;

        //No permission found
        if (!cmdPerms) {
          return null;
        }

        //Return
        return MainGuild.roles.cache.filter((role) =>
          role.permissions.has(cmdPerms)
        );
      };

      //Define fullPermissions
      const fullPermissions = command.reduce((collectionOfRoles, role) => {
        const rolesForFullPermission = roles(role.name);

        if (!rolesForFullPermission) {
          return collectionOfRoles;
        }

        //Define permission
        const permissions = rolesForFullPermission.reduce(
          (collectionOfRolesForFullPermission, role) => {
            return [
              ...collectionOfRolesForFullPermission,
              { id: role.id, type: 'ROLE', permission: true },
            ];
          },
          []
        );

        return [...collectionOfRoles, { id: role.id, permissions }];
      }, []);

      //Set all permissions on server
      await MainGuild.commands.permissions.set({ fullPermissions });
    });
  });
};
