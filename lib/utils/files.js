"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFolder = createFolder;
exports.writeFile = writeFile;
exports.loadFile = exports.isFileExist = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var isFileExist = function isFileExist(path) {
  return _fs["default"].existsSync(path);
};

exports.isFileExist = isFileExist;

var loadFile = function loadFile(path) {
  return new Promise(function (resolve) {
    if (!path) {
      throw new Error("Path is empty!");
    }

    if (!_fs["default"].existsSync(path)) {
      throw new Error("File doesn't exist");
    }

    _fs["default"].readFile(path, "utf8", function (error, data) {
      if (error) throw new Error(error);
      resolve(JSON.parse(data));
    });
  });
};

exports.loadFile = loadFile;

function createFolder(_x) {
  return _createFolder.apply(this, arguments);
}

function _createFolder() {
  _createFolder = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dir) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (dir) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", Promise.reject("Dir is required"));

          case 2:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              try {
                if (!_fs["default"].existsSync(dir)) {
                  _fs["default"].mkdir(dir, {
                    recursive: true
                  }, function (error) {
                    if (error) throw error;
                    resolve(true);
                  });
                }

                resolve(true);
              } catch (error) {
                reject(error);
              }
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createFolder.apply(this, arguments);
}

function write(_x2, _x3) {
  return _write.apply(this, arguments);
}

function _write() {
  _write = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(file, filePath) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return new Promise(function (resolve, reject) {
              try {
                _fs["default"].writeFile(filePath, file, "utf-8", function (error) {
                  if (error) throw new Error("".concat(error));
                  resolve();
                });
              } catch (error) {
                reject(error);
              }
            });

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _write.apply(this, arguments);
}

function writeFile(_x4, _x5) {
  return _writeFile.apply(this, arguments);
}

function _writeFile() {
  _writeFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(file, filePath) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!file || !filePath)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", Promise.reject("File, path, name are required!"));

          case 2:
            _context3.next = 4;
            return createFolder(_path["default"].parse(filePath).dir);

          case 4:
            _context3.next = 6;
            return write(file, filePath);

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _writeFile.apply(this, arguments);
}