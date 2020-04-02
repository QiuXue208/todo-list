const db = require("../db.js");
const fs = require("fs");
jest.mock("fs");
describe("db", () => {
  it("can read", async () => {
    const data = { title: "study", done: true };
    // 设置某个路径对应的error和data
    fs.setMock("./xyz", null, JSON.stringify(data));
    // 对象相等要用toStrictEqual
    const list = await db.read("./xyz");
    expect(list).toStrictEqual(data);
  });
});
