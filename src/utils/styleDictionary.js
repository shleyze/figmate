import { writeFile } from "./index";

const addCallbackActionToPlatforms = (obj, actionName) => {
  return Object.entries(obj).reduce((acc, [key, item]) => {
    const { actions = [] } = item;

    acc[key] = {
      ...item,
      ...(!actions.includes(actionName) && {
        actions: actions.concat(actionName)
      })
    };

    return acc;
  }, {});
};

export async function buildTokensFromDic(dic, config) {
  const { tempFolder, platforms: defaultPlatforms } = config;
  const DIC_TEMP_FILE = `${tempFolder}/dic.json`;

  await writeFile(JSON.stringify(dic, null, 2), DIC_TEMP_FILE);

  return new Promise((resolve, reject) => {
    try {
      const callbackActionName = "callback";
      const platforms = addCallbackActionToPlatforms(
        defaultPlatforms,
        callbackActionName
      );
      const StyleDictionary = require("style-dictionary").extend({
        source: [DIC_TEMP_FILE],
        platforms
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
        undo: () => {}
      });

      StyleDictionary.buildAllPlatforms();
    } catch (error) {
      reject(error);
    }
  });
}
