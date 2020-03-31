const { program } = require("commander");

program
  .option("-t, --todo", "todo")
  .option("-l, --list", "list")
  .version("0.0.1", "-v, --version");

program
  .command("add <taskName>")
  .description("add a task")
  .action((args, description) => {});

program
  .command("clear")
  .description("clear all task")
  .action((args, description) => {});

program.parse(process.argv);
