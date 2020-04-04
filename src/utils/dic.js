const merge = require("lodash/merge");
const { writeFile } = require("./files");

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

async function buildTokens(dic, config) {
  const { tempFolder, platforms: defaultPlatforms } = config;
  const DIC_TEMP_FILE = `${tempFolder}/dic.json`;

  await writeFile(JSON.stringify(dic, null, 2), DIC_TEMP_FILE);

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
            resolve([null]);
          } else {
            callbackActionCounter++;
          }
        },
        undo: () => {},
      });

      StyleDictionary.buildAllPlatforms();
    } catch (error) {
      resolve([error]);
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
            acc[key] = {
              value,
              ...(description && { comment: description }),
            };
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
