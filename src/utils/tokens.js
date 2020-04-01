import { rgba } from "polished";

const getNode = (path, node) =>
  path.split("/").reduce((acc, currentPath) => {
    if (acc.children) {
      return acc.children.find(({ name }) => name === currentPath) || {};
    }

    return {};
  }, node);

const getColorValue = color => {
  // Convert color to web rgba format
  color.r *= 255;
  color.g *= 255;
  color.b *= 255;

  return rgba(
    Math.round(color.r),
    Math.round(color.g),
    Math.round(color.b),
    Math.round(color.a * 100) / 100
  );
};

const formatFontToCSS = style => {
  const keys = Object.keys(style);
  const mapRule = {
    fontFamily: "font-family",
    fontWeight: "font-weight",
    fontSize: "font-size",
    lineHeightPx: "line-height"
  };

  const rules = {};
  keys.forEach(key => {
    if (mapRule[key]) {
      let value = style[key];
      if (key === "fontSize" || key === "lineHeightPx") {
        value = `${Math.round(value)}px`;
      }
      rules[mapRule[key]] = value;
    }
  });

  return rules;
};

const formatShadowToCSS = styles => {
  const rawProperties = [].concat(styles);
  const properties = rawProperties.map(({ color, offset, radius }) => {
    const { x, y } = offset;
    const rgbaColor = getColorValue(color);

    return `${x}px ${y}px ${radius}px ${rgbaColor}`;
  });

  return properties.join(", ");
};

const tokenTypes = {
  "style/text": "text",
  "style/fill": "fill",
  "style/shadow": "DROP_SHADOW",
  space: true,
  radius: true
};

const parseNode = (node, options, handler) => {
  if (!node) {
    return;
  }
  const { styles, type, nodeType = "RECTANGLE" } = options;

  // Check node stuff
  if (node.styles) {
    const { fills, effects } = node;

    if (fills && fills.length) {
      const { style, styles: styleRefs } = node;

      // has css properties
      fills.forEach(fill => {
        const { color, opacity } = fill;
        // Check for fill style
        if (!color) {
          return;
        }

        const rgbaColor = getColorValue(color);
        const styleTypes = Object.entries(styleRefs);

        styleTypes.forEach(([styleType, ref]) => {
          const styleRef = styles[ref];
          if (styleRef) {
            const { name, description } = styleRef;
            const tokenType = tokenTypes[type];
            const isEqualTypes = tokenType === styleType;
            const isTypeFill = styleType === "fill";
            const isTypeText = styleType === "text";

            if (isEqualTypes && isTypeFill) {
              handler &&
                handler(name, { description, styles: { color: rgbaColor } });
            }

            if (isEqualTypes && isTypeText && style) {
              handler &&
                handler(name, {
                  description,
                  styles: formatFontToCSS(style)
                });
            }
          }
        });
      });
    }

    if (effects && effects.length) {
      const { styles: styleRefs } = node;
      const styleTypes = Object.entries(styleRefs);

      const combinedEffects = effects.reduce((acc, effect) => {
        const { type, visible } = effect;
        if (!visible) {
          return acc;
        }

        if (!acc[type]) {
          acc[type] = [];
        }

        acc[type] = acc[type].concat(effect);

        return acc;
      }, {});

      Object.entries(combinedEffects).forEach(([effectType, properties]) => {
        styleTypes.forEach(([styleType, ref]) => {
          const styleRef = styles[ref];
          if (styleRef) {
            const { name, description } = styleRef;

            if (styleType === "effect" && tokenTypes[type] === effectType) {
              handler &&
                handler(name, {
                  description,
                  styles: { "box-shadow": formatShadowToCSS(properties) }
                });
            }
          }
        });
      });
    }
  }

  // Check other params
  if (node.type === nodeType) {
    const { name } = node;

    if (tokenTypes[type] && type === "space") {
      const { absoluteBoundingBox } = node;
      const { height } = absoluteBoundingBox;

      handler && handler(name, { styles: { height: `${height}px` } });
    }

    if (tokenTypes[type] && type === "radius") {
      const { cornerRadius, rectangleCornerRadii, absoluteBoundingBox } = node;
      const { width, height } = absoluteBoundingBox;
      const isEqualRadius = [...new Set(rectangleCornerRadii)].length === 1;
      let radius = null;

      if (isEqualRadius) {
        radius = `${cornerRadius}px`;
      } else {
        radius = `${rectangleCornerRadii.join("px ")}px`;
      }

      if (isEqualRadius && width + height === cornerRadius) {
        radius = "50%";
      }

      handler && handler(name, { styles: { "border-radius": radius } });
    }
  }

  // If no children then return.
  if (!node.children) {
    return;
  }

  // Travel the tree
  node.children.forEach(childNode => {
    parseNode(childNode, options, handler);
  });
};

const getStyles = (node, options) => {
  const list = {};
  const handler = (name, params) => (list[name] = params);

  parseNode(node, options, handler);

  return Object.entries(list).map(([name, params]) => ({ name, ...params }));
};

export const getTokens = (file, config) => {
  const { document, styles } = file;
  const { boards } = config;

  return boards
    .map(({ path, ...restOptions }) =>
      getStyles(getNode(path, document), { styles, ...restOptions })
    )
    .filter(board => board.length);
};
