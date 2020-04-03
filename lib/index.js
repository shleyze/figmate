#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ink = require("ink");

var _utils = require("./utils");

var isCLIEnv = require.main === module;

function figmate(_x) {
  return _figmate.apply(this, arguments);
}

function _figmate() {
  _figmate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(config) {
    var CONFIG, FILE, RAW_TOKENS, logTokens, DIC_TOKENS;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.getConfig)(config);

          case 2:
            CONFIG = _context.sent;
            _context.next = 5;
            return (0, _utils.getFigmaFile)(CONFIG);

          case 5:
            FILE = _context.sent;
            RAW_TOKENS = (0, _utils.getTokens)(FILE, CONFIG);
            logTokens = (0, _ink.render)(_utils.log.tokens(RAW_TOKENS));
            logTokens.unmount();
            _context.next = 11;
            return logTokens.waitUntilExit();

          case 11:
            DIC_TOKENS = (0, _utils.transformToDictionary)(RAW_TOKENS);
            _context.next = 14;
            return (0, _utils.buildTokensFromDic)(DIC_TOKENS, CONFIG);

          case 14:
            _context.next = 16;
            return (0, _utils.cleanUp)(CONFIG);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _figmate.apply(this, arguments);
}

if (isCLIEnv) {
  figmate()["catch"](function (error) {
    return (0, _ink.render)(_utils.log.error(error));
  });
}

var _default = figmate;
exports["default"] = _default;