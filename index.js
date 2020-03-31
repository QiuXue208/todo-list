const homedir = require("os").homedir();
// 获取home变量, 如果读不到就取home目录
const home = process.env.HOME || homedir;
const path = require("path");
const fs = require("fs");
const dbPath = path.join(home, "todos");

module.exports.add = tasks => {
  // 读取之前的任务
  fs.readFile(dbPath, { flag: "a+" }, (err, data) => {
    let list;
    if (err) {
      // console.log(err);
    }
    try {
      list = JSON.parse(data.toString());
    } catch (err1) {
      list = [];
    }
    // 将此次要添加的任务添加到读取的任务里
    tasks.forEach(item => {
      list.push({
        title: item,
        done: false
      });
    });
    // 将所有任务写进文件
    fs.writeFile(dbPath, JSON.stringify(list), err2 => {});
  });
};
