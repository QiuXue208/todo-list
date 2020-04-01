const db = require("./db.js");
const inquirer = require("inquirer");

module.exports.add = async tasks => {
  // 读取之前的任务
  const list = await db.read();
  // 将此次要添加的任务添加到读取的任务里
  tasks.forEach(item => {
    list.push({
      title: item,
      done: false
    });
  });
  // 将所有任务写进文件
  await db.write(list);
};

module.exports.clear = async () => {
  await db.write([]);
};

module.exports.showAll = async () => {
  const list = await db.read();

  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "请选择你要进行的操作",
      choices: [
        { name: "退出", value: -1 },
        { name: "创建任务", value: -2 },
        ...list.map((item, index) => ({
          name: `${item.done ? "[√]" : "[x]"} ${index + 1}. ${item.title}`,
          value: index
        }))
      ]
    })
    .then(answers => {
      const { index } = answers;
      if (index === -2) {
        // 创建任务
        inquirer
          .prompt({
            type: "input",
            name: "title",
            message: "请输入任务名"
          })
          .then(answers => {
            list.push({ title: answers.title, done: false });
            db.write(list);
          });
      } else if (index >= 0) {
        // 选中任务
        inquirer
          .prompt({
            type: "list",
            name: "action",
            message: "请选择你要进行的操作",
            choices: [
              { name: "退出", value: "quit" },
              { name: "标记为完成", value: "markAsDone" },
              { name: "标记为未完成", value: "markAsUndone" },
              { name: "删除", value: "delete" },
              { name: "编辑", value: "edit" }
            ]
          })
          .then(answers => {
            const { action } = answers;
            switch (action) {
              case "markAsDone":
                list[index].done = true;
                db.write(list);
                break;
              case "markAsUndone":
                list[index].done = false;
                db.write(list);
                break;
              case "delete":
                list.splice(index, 1);
                db.write(list);
                break;
              case "edit":
                inquirer
                  .prompt({
                    type: "input",
                    name: "title",
                    message: "请输入任务名",
                    default: list[index].title
                  })
                  .then(answers => {
                    list[index].title = answers.title;
                    db.write(list);
                  });
                break;
            }
          });
      }
    });
};
