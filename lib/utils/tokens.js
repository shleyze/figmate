"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokens = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _polished = require("polished");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getNode = function getNode(path, node) {
  return path.split("/").reduce(function (acc, currentPath) {
    if (acc.children) {
      return acc.children.find(function (_ref) {
        var name = _ref.name;
        return name === currentPath;
      }) || {};
    }

    return {};
  }, node);
};

var getColorValue = function getColorValue(color) {
  // Convert color to web rgba format
  color.r *= 255;
  color.g *= 255;
  color.b *= 255;
  return (0, _polished.rgba)(Math.round(color.r), Math.round(color.g), Math.round(color.b), Math.round(color.a * 100) / 100);
};

var formatFontToCSS = function formatFontToCSS(style) {
  var keys = Object.keys(style);
  var mapRule = {
    fontFamily: "font-family",
    fontWeight: "font-weight",
    fontSize: "font-size",
    lineHeightPx: "line-height"
  };
  var rules = {};
  keys.forEach(function (key) {
    if (mapRule[key]) {
      var value = style[key];

      if (key === "fontSize" || key === "lineHeightPx") {
        value = "".concat(Math.round(value), "px");
      }

      rules[mapRule[key]] = value;
    }
  });
  return rules;
};

var formatShadowToCSS = function formatShadowToCSS(styles) {
  var rawProperties = [].concat(styles);
  var properties = rawProperties.map(function (_ref2) {
    var color = _ref2.color,
        offset = _ref2.offset,
        radius = _ref2.radius;
    var x = offset.x,
        y = offset.y;
    var rgbaColor = getColorValue(color);
    return "".concat(x, "px ").concat(y, "px ").concat(radius, "px ").concat(rgbaColor);
  });
  return properties.join(", ");
};

var tokenTypes = {
  "style/text": "text",
  "style/fill": "fill",
  "style/shadow": "DROP_SHADOW",
  space: true,
  radius: true
};

var parseNode = function parseNode(node, options, handler) {
  if (!node) {
    return;
  }

  var styles = options.styles,
      type = options.type,
      _options$nodeType = options.nodeType,
      nodeType = _options$nodeType === void 0 ? "RECTANGLE" : _options$nodeType; // Check node stuff

  if (node.styles) {
    var fills = node.fills,
        effects = node.effects;

    if (fills && fills.length) {
      var style = node.style,
          styleRefs = node.styles; // has css properties

      fills.forEach(function (fill) {
        var color = fill.color; // Check for fill style

        if (!color) {
          return;
        }

        var rgbaColor = getColorValue(color);
        var styleTypes = Object.entries(styleRefs);
        styleTypes.forEach(function (_ref3) {
          var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
              styleType = _ref4[0],
              ref = _ref4[1];

          var styleRef = styles[ref];

          if (styleRef) {
            var name = styleRef.name,
                description = styleRef.description;
            var tokenType = tokenTypes[type];
            var isEqualTypes = tokenType === styleType;
            var isTypeFill = styleType === "fill";
            var isTypeText = styleType === "text";

            if (isEqualTypes && isTypeFill) {
              handler && handler(name, {
                description: description,
                styles: {
                  color: rgbaColor
                }
              });
            }

            if (isEqualTypes && isTypeText && style) {
              handler && handler(name, {
                description: description,
                styles: formatFontToCSS(style)
              });
            }
          }
        });
      });
    }

    if (effects && effects.length) {
      var _styleRefs = node.styles;
      var styleTypes = Object.entries(_styleRefs);
      var combinedEffects = effects.reduce(function (acc, effect) {
        var type = effect.type,
            visible = effect.visible;

        if (!visible) {
          return acc;
        }

        if (!acc[type]) {
          acc[type] = [];
        }

        acc[type] = acc[type].concat(effect);
        return acc;
      }, {});
      Object.entries(combinedEffects).forEach(function (_ref5) {
        var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
            effectType = _ref6[0],
            properties = _ref6[1];

        styleTypes.forEach(function (_ref7) {
          var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
              styleType = _ref8[0],
              ref = _ref8[1];

          var styleRef = styles[ref];

          if (styleRef) {
            var name = styleRef.name,
                description = styleRef.description;

            if (styleType === "effect" && tokenTypes[type] === effectType) {
              handler && handler(name, {
                description: description,
                styles: {
                  "box-shadow": formatShadowToCSS(properties)
                }
              });
            }
          }
        });
      });
    }
  } // Check other params


  if (node.type === nodeType) {
    var name = node.name;

    if (tokenTypes[type] && type === "space") {
      var absoluteBoundingBox = node.absoluteBoundingBox;
      var height = absoluteBoundingBox.height;
      handler && handler(name, {
        styles: {
          height: "".concat(height, "px")
        }
      });
    }

    if (tokenTypes[type] && type === "radius") {
      var cornerRadius = node.cornerRadius,
          rectangleCornerRadii = node.rectangleCornerRadii,
          _absoluteBoundingBox = node.absoluteBoundingBox;
      var width = _absoluteBoundingBox.width,
          _height = _absoluteBoundingBox.height;
      var isEqualRadius = (0, _toConsumableArray2["default"])(new Set(rectangleCornerRadii)).length === 1;
      var radius = null;

      if (isEqualRadius) {
        radius = "".concat(cornerRadius, "px");
      } else {
        radius = "".concat(rectangleCornerRadii.join("px "), "px");
      }

      if (isEqualRadius && width + _height === cornerRadius) {
        radius = "50%";
      }

      handler && handler(name, {
        styles: {
          "border-radius": radius
        }
      });
    }
  } // If no children then return.


  if (!node.children) {
    return;
  } // Travel the tree


  node.children.forEach(function (childNode) {
    parseNode(childNode, options, handler);
  });
};

var getStyles = function getStyles(node, options) {
  var list = {};

  var handler = function handler(name, params) {
    return list[name] = params;
  };

  parseNode(node, options, handler);
  return Object.entries(list).map(function (_ref9) {
    var _ref10 = (0, _slicedToArray2["default"])(_ref9, 2),
        name = _ref10[0],
        params = _ref10[1];

    return _objectSpread({
      name: name
    }, params);
  });
};

var getTokens = function getTokens(file, config) {
  var document = file.document,
      styles = file.styles;
  var boards = config.boards;
  return boards.map(function (_ref11) {
    var path = _ref11.path,
        restOptions = (0, _objectWithoutProperties2["default"])(_ref11, ["path"]);
    return getStyles(getNode(path, document), _objectSpread({
      styles: styles
    }, restOptions));
  }).filter(function (board) {
    return board.length;
  });
};

exports.getTokens = getTokens;