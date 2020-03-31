const { program } = require("commander");
const api = require("./index.js");

program
  .option("-t, --todo", "todo")
  .option("-l, --list", "list")
  .version("0.0.1", "-v, --version");

program
  .command("add <taskName>")
  .description("add a task")
  .action((_, description) => {
    api.add(description.args);
  });

program
  .command("clear")
  .description("clear all task")
  .action(() => {
    api.clear();
  });

program.parse(process.argv);
