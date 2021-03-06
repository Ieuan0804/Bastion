/**
 * @file Module Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = require('fs');
const path = require('path');
const color = require('chalk');
const { Collection } = require('discord.js');
const commandInfo = require('../locales/en_us/command.json');

/* eslint-disable no-sync */
let Commands = new Collection();
let Aliases = new Collection();

let commandFiles = fs.readdirSync(path.resolve('./commands/')).
  filter(file => !fs.statSync(path.resolve('./commands/', file)).isDirectory()).
  filter(file => file.endsWith('.js'));

for (let file of commandFiles) {
  file = file.substr(0, file.length - 3);
  process.stdout.write(`${color.cyan('[Bastion]:')} Loading ${file} command...\n`);

  file = require(path.resolve(`./commands/${file}`));
  Commands.set(file.help.name.toLowerCase(), file);

  if (commandInfo[file.help.name]) {
    file.config.module = commandInfo[file.help.name].module;
  }
  else {
    throw new Error(`The \`${file.help.name}\` command has not been described in the default locale strings.`);
  }

  for (let alias of file.config.aliases) {
    Aliases.set(alias.toLowerCase(), file.help.name);
  }

  if (process.stdout.moveCursor && process.stdout.clearLine) {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine();
  }
}

exports.commands = Commands;
exports.aliases = Aliases;
