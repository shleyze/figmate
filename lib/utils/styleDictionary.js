"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTokensFromDic = buildTokensFromDic;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _index = require("./index");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var addCallbackActionToPlatforms = function addCallbackActionToPlatforms(obj, actionName) {
  return Object.entries(obj).reduce(function (acc, _ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        key = _ref2[0],
        item = _ref2[1];

    var _item$actions = item.actions,
        actions = _item$actions === void 0 ? [] : _item$actions;
    acc[key] = _objectSpread({}, item, {}, !actions.includes(actionName) && {
      actions: actions.concat(actionName)
    });
    return acc;
  }, {});
};

function buildTokensFromDic(_x, _x2) {
  return _buildTokensFromDic.apply(this, arguments);
}

function _buildTokensFromDic() {
  _buildTokensFromDic = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dic, config) {
    var tempFolder, defaultPlatforms, DIC_TEMP_FILE;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tempFolder = config.tempFolder, defaultPlatforms = config.platforms;
            DIC_TEMP_FILE = "".concat(tempFolder, "/dic.json");
            _context.next = 4;
            return (0, _index.writeFile)(JSON.stringify(dic, null, 2), DIC_TEMP_FILE);

          case 4:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              try {
                var callbackActionName = "callback";
                var platforms = addCallbackActionToPlatforms(defaultPlatforms, callbackActionName);

                var StyleDictionary = require("style-dictionary").extend({
                  source: [DIC_TEMP_FILE],
                  platforms: platforms
                }); // Imitate fire callback


                var callbackActionCounter = 0;
                StyleDictionary.registerAction({
                  name: callbackActionName,
                  "do": function _do() {
                    var shouldFireCallback = callbackActionCounter === Object.keys(platforms).length - 1;

                    if (shouldFireCallback) {
                      resolve();
                    } else {
                      callbackActionCounter++;
                    }
                  },
                  undo: function undo() {}
                });
                StyleDictionary.buildAllPlatforms();
              } catch (error) {
                reject(error);
              }
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _buildTokensFromDic.apply(this, arguments);
}