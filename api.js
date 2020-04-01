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
  askForAction(list);
};

const askForAction = list => {
  const questions = {
    type: "list",
    name: "action",
    message: "请选择你要进行的操作",
    choices: [
      { name: "退出", value: "quit" },
      { name: "查看任务", value: "showAllTasks" },
      { name: "创建任务", value: "askForCreate" },
      { name: "编辑任务", value: "askForEdit" },
      { name: "删除任务", value: "askForDelete" },
      { name: "编辑为已完成", value: "askForMarkAsDone" },
      { name: "编辑为未完成", value: "askForMarkAsUndone" }
    ]
  };
  inquirer.prompt(questions).then(answers => {
    const actions = {
      showAllTasks,
      askForCreate,
      askForEdit,
      askForDelete,
      askForMarkAsDone,
      askForMarkAsUndone
    };
    const action = actions[answers.action];
    action && action(list);
  });
};

const askForCreate = list => {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入任务名"
    })
    .then(answers => {
      if (answers.title) {
        list.push({ title: answers.title, done: false });
        db.write(list);
      }
    });
};

const askForEdit = list => {
  showAllTasks(list, index => {
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
  });
};

const askForDelete = list => {
  showAllTasks(list, index => {
    list.splice(index, 1);
    db.write(list);
  });
};

const askForMarkAsDone = list => {
  showAllTasks(list, index => {
    list[index].done = true;
    db.write(list);
  });
};

const askForMarkAsUndone = list => {
  showAllTasks(list, index => {
    list[index].done = false;
    db.write(list);
  });
};

const showAllTasks = (list, callback) => {
  const questions = {
    type: "list",
    name: "index",
    message: "选择任务",
    choices: [
      { name: "退出", value: "-1" },
      ...list.map((item, index) => ({
        name: `${item.done ? "[√]" : "[x]"} ${index + 1}. ${item.title}`,
        value: index
      }))
    ]
  };
  inquirer.prompt(questions).then(answers => {
    const { index } = answers;
    if (callback && index >= 0) callback(index);
  });
};
