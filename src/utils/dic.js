const merge = require("lodash/merge");
const { get: getConfig } = require("./config");
const { get: getRawTokens } = require("./tokens");
const { writeFile, deleteFolder } = require("./files");

function addCallbackActionToPlatforms(obj, actionName) {
  return Object.entries(obj).reduce((acc, [key, item]) => {
    const { actions = [] } = item;

    acc[key] = {
      ...item,
      ...(!actions.includes(actionName) && {
        actions: actions.concat(actionName),
      }),
    };

    return acc;
  }, {});
}

const getId = () => `f${(~~(Math.random() * 1e8)).toString(16)}`;

async function buildTokens(file, config) {
  const CONFIG = await getConfig(config);
  const RAW_TOKENS = getRawTokens(file, CONFIG);
  const DIC_TOKENS = transform(RAW_TOKENS);

  const { tempFolder, platforms: defaultPlatforms } = CONFIG;
  const DIC_TEMP_FILE = `${tempFolder}/dic_${getId()}.json`;

  await writeFile(JSON.stringify(DIC_TOKENS, null, 2), DIC_TEMP_FILE);

  return new Promise((resolve) => {
    try {
      const callbackActionName = "callback";
      const platforms = addCallbackActionToPlatforms(
        defaultPlatforms,
        callbackActionName
      );
      const StyleDictionary = require("style-dictionary").extend({
        source: [DIC_TEMP_FILE],
        platforms,
      });

      // Imitate fire callback
      let callbackActionCounter = 0;

      StyleDictionary.registerAction({
        name: callbackActionName,
        do: () => {
          const shouldFireCallback =
            callbackActionCounter === Object.keys(platforms).length - 1;

          if (shouldFireCallback) {
            resolve();
          } else {
            callbackActionCounter++;
          }
        },
        undo: () => {},
      });

      StyleDictionary.buildAllPlatforms();

      deleteFolder(DIC_TEMP_FILE);
    } catch (error) {
      throw new Error(error);
    }
  });
}

function transform(arr) {
  return arr.reduce((acc, item) => {
    item.forEach(({ name, description, styles = {} }) => {
      const path = name.split("/");
      const obj = {};
      path.reduce((acc, item, index, src) => {
        const isLast = src.length - 1 === index;

        if (isLast) {
          acc[item] = Object.entries(styles).reduce((acc, [key, value]) => {
            if (key === "value") {
              acc["value"] = value;
              if (description) {
                acc["comment"] = description;
              }
            } else {
              acc[key] = {
                value,
                ...(description && { comment: description }),
              };
            }

            return acc;
          }, {});
        } else {
          acc[item] = {};
        }

        return acc[item];
      }, obj);

      acc = merge(acc, obj);
    });

    return acc;
  }, {});
}

module.exports = {
  transform,
  buildTokens,
};
