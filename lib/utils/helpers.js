"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.log = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _ink = require("ink");

var _inkSpinner = _interopRequireDefault(require("ink-spinner"));

var _inkTable = _interopRequireDefault(require("ink-table"));

var _inkDivider = _interopRequireDefault(require("ink-divider"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var error = function error(_error) {
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, null, /*#__PURE__*/_react["default"].createElement(_ink.Color, {
    red: true
  }, _error.message));
};

var loading = function loading() {
  return /*#__PURE__*/_react["default"].createElement(_ink.Box, null, /*#__PURE__*/_react["default"].createElement(_ink.Box, null, /*#__PURE__*/_react["default"].createElement(_ink.Color, {
    green: true
  }, /*#__PURE__*/_react["default"].createElement(_inkSpinner["default"], {
    type: "dots"
  }))), /*#__PURE__*/_react["default"].createElement(_ink.Box, {
    marginLeft: 2
  }, "Loading"));
};

var loaded = function loaded() {
  return /*#__PURE__*/_react["default"].createElement(_ink.Static, null, /*#__PURE__*/_react["default"].createElement(_ink.Box, null, "Loaded"));
};

var tokens = function tokens(arr) {
  var flatParams = function flatParams(arr) {
    return arr.map(function (_ref) {
      var _ref$styles = _ref.styles,
          styles = _ref$styles === void 0 ? {} : _ref$styles,
          _ref$exports = _ref.exports,
          exports = _ref$exports === void 0 ? [] : _ref$exports,
          rest = (0, _objectWithoutProperties2["default"])(_ref, ["styles", "exports"]);

      var flatStyles = function flatStyles(obj) {
        return Object.entries(obj).reduce(function (acc, _ref2) {
          var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
              key = _ref3[0],
              value = _ref3[1];

          acc[key] = value;
          return acc;
        }, {});
      };

      var flatExports = function flatExports(arr) {
        return arr.reduce(function (acc, item, index) {
          var suffix = item.suffix,
              format = item.format;
          acc["suffix".concat(index > 0 ? "_".concat(index) : "")] = suffix;
          acc["format".concat(index > 0 ? "_".concat(index) : "")] = format;
          return acc;
        }, {});
      };

      return _objectSpread({}, rest, {}, flatStyles(styles), {}, flatExports(exports));
    });
  };

  var guessType = function guessType() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if ("font-family" in obj) {
      return "Typography";
    }

    if ("color" in obj) {
      return "Colors";
    }

    if ("box-shadow" in obj) {
      return "Shadows";
    }

    if ("height" in obj) {
      return "Space";
    }

    if ("border-radius" in obj) {
      return "Radius";
    }

    if ("exports" in obj) {
      return "Exports";
    }

    return null;
  };

  return /*#__PURE__*/_react["default"].createElement(_ink.Static, null, arr.map(function (item, index) {
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
      key: index
    }, /*#__PURE__*/_react["default"].createElement(_inkDivider["default"], {
      title: "".concat(guessType(item[0]["styles"] || item[0]), ", size: ").concat(item.length)
    }), /*#__PURE__*/_react["default"].createElement(_inkTable["default"], {
      data: flatParams(item)
    }));
  }));
};

var log = {
  error: error,
  loading: loading,
  loaded: loaded,
  tokens: tokens
};
exports.log = log;
var messages = {
  tokenNotFound: "Token is required!",
  fileIdNotFound: "File id is required!"
};
exports.messages = messages;