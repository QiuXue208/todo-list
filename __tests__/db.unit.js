const db = require("../db.js");
const fs = require("fs");
jest.mock("fs");
describe("db", () => {
  afterEach(() => {
    //每执行完一个it，就调用改语句
    fs.clearMocks();
  });
  it("can read", async () => {
    const data = { title: "study", done: true };
    // 设置某个路径对应的error和data
    fs.setReadMock("./xyz", null, JSON.stringify(data));
    // 对象相等要用toStrictEqual
    const list = await db.read("./xyz");
    expect(list).toStrictEqual(data);
  });

  it("can write", async () => {
    let fakeFile;
    fs.setWriteMocks("./yyy", (path, data, callback) => {
      fakeFile = data;
      callback(null);
    });
    const list = [{ title: "eat", done: false }];
    await db.write(list, "./yyy");
    expect(fakeFile).toStrictEqual(JSON.stringify(list) + "\n");
  });
});
