import React, { Fragment } from "react";
import { render, Box, Color, Static } from "ink";
import Spinner from "ink-spinner";
import Table from "ink-table";
import Divider from "ink-divider";

const error = error => (
  <Static>
    <Color red>{error.message}</Color>
  </Static>
);
const loading = () => (
  <Box>
    <Box>
      <Color green>
        <Spinner type="dots" />
      </Color>
    </Box>
    <Box marginLeft={2}>Loading</Box>
  </Box>
);
const loaded = () => (
  <Static>
    <Box>Loaded</Box>
  </Static>
);
const tokens = arr => {
  const flatParams = arr =>
    arr.map(({ styles = {}, exports = [], ...rest }) => {
      const flatStyles = obj =>
        Object.entries(obj).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const flatExports = arr =>
        arr.reduce((acc, item, index) => {
          const { suffix, format } = item;

          acc[`suffix${index > 0 ? `_${index}` : ""}`] = suffix;
          acc[`format${index > 0 ? `_${index}` : ""}`] = format;
          return acc;
        }, {});

      return { ...rest, ...flatStyles(styles), ...flatExports(exports) };
    });

  const guessType = (obj = {}) => {
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

  return (
    <Static>
      {arr.map((item, index) => (
        <Fragment key={index}>
          <Divider
            title={`${guessType(item[0]["styles"] || item[0])}, size: ${
              item.length
            }`}
          />
          <Table data={flatParams(item)} />
        </Fragment>
      ))}
    </Static>
  );
};

export const log = { error, loading, loaded, tokens };
export const messages = {
  tokenNotFound: "Token is required!",
  fileIdNotFound: "File id is required!"
};
