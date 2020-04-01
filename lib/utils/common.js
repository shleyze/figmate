"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.getFigmaFile = getFigmaFile;
exports.cleanUp = cleanUp;
exports.transformToDictionary = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _merge = _interopRequireDefault(require("lodash/merge"));

var Figma = _interopRequireWildcard(require("figma-api"));

var _ink = require("ink");

var _index = require("./index");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var PACKAGE_NAME = "figmate";

function getConfig() {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var USER_ROOT, CONFIG_PATH, PACKAGE_CONFIG_PATH, _dotenv$config, ENV_CONFIG, USER_CONFIG, USER_PACKAGE_CONFIG, DEFAULT_CONFIG;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            USER_ROOT = process.cwd();
            CONFIG_PATH = "".concat(USER_ROOT, "/").concat(PACKAGE_NAME, ".config.json");
            PACKAGE_CONFIG_PATH = "".concat(USER_ROOT, "/package.json");
            _dotenv$config = _dotenv["default"].config(), ENV_CONFIG = _dotenv$config.parsed;
            _context.next = 6;
            return (0, _index.loadFile)(CONFIG_PATH)["catch"](function () {});

          case 6:
            USER_CONFIG = _context.sent;
            _context.next = 9;
            return (0, _index.loadFile)(PACKAGE_CONFIG_PATH)["catch"](function () {});

          case 9:
            USER_PACKAGE_CONFIG = _context.sent;
            DEFAULT_CONFIG = {
              token: ENV_CONFIG && ENV_CONFIG.FIGMA_TOKEN || null,
              fileId: ENV_CONFIG && ENV_CONFIG.FIGMA_FILE_ID || null,
              tempFolder: _path["default"].join(_path["default"].resolve(__dirname, "../../"), "temp"),
              buildPath: "",
              boards: [{
                path: "🔺Token/Fonts",
                type: "style/text"
              }, {
                path: "🔺Token/Colors",
                type: "style/fill"
              }, {
                path: "🔺Token/Shadows",
                type: "style/shadow"
              }, {
                path: "🔺Token/Indents",
                type: "space"
              }, {
                path: "🔺Token/Forms",
                type: "radius"
              }],
              platforms: {
                scss: {
                  transformGroup: "scss",
                  files: [{
                    destination: "_variables.scss",
                    format: "scss/variables"
                  }]
                },
                css: {
                  transformGroup: "css",
                  files: [{
                    destination: "variables.css",
                    format: "css/variables"
                  }]
                }
              }
            };
            return _context.abrupt("return", (0, _merge["default"])(DEFAULT_CONFIG, USER_PACKAGE_CONFIG[PACKAGE_NAME], USER_CONFIG));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getConfig.apply(this, arguments);
}

function getFigmaFile(_x) {
  return _getFigmaFile.apply(this, arguments);
}

function _getFigmaFile() {
  _getFigmaFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(config) {
    var tempFolder, FIGMA_TEMP_FILE, token, fileId, FigmaAPI, loading, FILE;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tempFolder = config.tempFolder;
            FIGMA_TEMP_FILE = "".concat(tempFolder, "/figma.json");

            if (!(0, _index.isFileExist)(FIGMA_TEMP_FILE)) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return (0, _index.loadFile)(FIGMA_TEMP_FILE);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            token = config.token, fileId = config.fileId;

            if (token) {
              _context2.next = 9;
              break;
            }

            throw new Error(_index.messages.tokenNotFound);

          case 9:
            if (fileId) {
              _context2.next = 11;
              break;
            }

            throw new Error(_index.messages.fileIdNotFound);

          case 11:
            FigmaAPI = new Figma.Api({
              personalAccessToken: token
            });
            loading = (0, _ink.render)(_index.log.loading());
            _context2.next = 15;
            return FigmaAPI.getFile(fileId)["catch"](function (_ref4) {
              var data = _ref4.response.data;
              throw new Error(data.err);
            });

          case 15:
            FILE = _context2.sent;
            _context2.next = 18;
            return (0, _index.writeFile)(JSON.stringify(FILE, null, 2), FIGMA_TEMP_FILE);

          case 18:
            loading.rerender(_index.log.loaded());
            loading.unmount();
            _context2.next = 22;
            return loading.waitUntilExit();

          case 22:
            return _context2.abrupt("return", FILE);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getFigmaFile.apply(this, arguments);
}

var transformToDictionary = function transformToDictionary(arr) {
  return arr.reduce(function (acc, item) {
    item.forEach(function (_ref) {
      var name = _ref.name,
          description = _ref.description,
          _ref$styles = _ref.styles,
          styles = _ref$styles === void 0 ? {} : _ref$styles;
      var path = name.split("/");
      var obj = {};
      path.reduce(function (acc, item, index, src) {
        var isLast = src.length - 1 === index;

        if (isLast) {
          acc[item] = Object.entries(styles).reduce(function (acc, _ref2) {
            var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
                key = _ref3[0],
                value = _ref3[1];

            acc[key] = _objectSpread({
              value: value
            }, description && {
              comment: description
            });
            return acc;
          }, {});
        } else {
          acc[item] = {};
        }

        return acc[item];
      }, obj);
      acc = (0, _merge["default"])(acc, obj);
    });
    return acc;
  }, {});
};

exports.transformToDictionary = transformToDictionary;

function cleanUp(_x2) {
  return _cleanUp.apply(this, arguments);
}

function _cleanUp() {
  _cleanUp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(config) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve) {
              var tempFolder = config.tempFolder;
              (0, _rimraf["default"])(tempFolder, function (error) {
                if (error) throw new Error("".concat(error));
                resolve();
              });
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _cleanUp.apply(this, arguments);
}