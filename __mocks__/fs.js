const path = require("path");
const fs = jest.genMockFromModule("fs");
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);
const readMocks = {};

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

module.exports = fs;
