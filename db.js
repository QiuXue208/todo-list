const path = require("path");
const fs = require("fs");
const homedir = require("os").homedir();
// 获取home变量, 如果读不到就取home目录
const home = process.env.HOME || homedir;
const dbPath = path.join(home, "todos");

const db = {
  read(path = dbPath) {
    // 读取文件是一个异步操作
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        let list;
        if (err) return reject(err);
        try {
          list = JSON.parse(data.toString());
        } catch (err1) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list) + "\n", err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};
module.exports = db;
