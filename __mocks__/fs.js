const path = require("path");
const fs = jest.genMockFromModule("fs");
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);
const readMocks = {};
const writeMocks = {};

fs.setReadMock = (path, error, data) => {
  readMocks[path] = [error, data];
};

// 覆盖原来的readFile
fs.readFile = (path, options, callback) => {
  if (callback === undefined) callback = options;
  if (path in readMocks) {
    callback(...readMocks[path]);
  } else {
    _fs.readFile(path, options, callback);
  }
};

fs.setWriteMocks = (path, fn) => {
  writeMocks[path] = fn;
};

fs.writeFile = (path, data, options, callback) => {
  if (path in writeMocks) {
    writeMocks[path](path, data, options, callback);
  } else {
    _fs.writeFile(path, data, options, callback);
  }
};

module.exports = fs;
