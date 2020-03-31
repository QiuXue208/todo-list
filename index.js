const db = require("./db.js");

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
