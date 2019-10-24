export default ({ blockPattern }) => {
  if (!(blockPattern instanceof RegExp || typeof blockPattern === 'string')) {
    throw new Error("'blockPattern' should be a string or regular expression.");
  }
  const shouldBlock = fileName => {
    if (blockPattern instanceof RegExp) {
      return fileName.test(blockPattern);
    }
    return fileName.includes(blockPattern);
  };
  return {
    name: 'rollup-plugin-block',
    writeBundle(bundle) {
      for (const fileName in bundle) {
        for (const moduleFilename in bundle[fileName].modules) {
          if (
            bundle[fileName].modules[moduleFilename].renderedExports.length &&
            shouldBlock(fileName)
          ) {
            this.error(`"${moduleFilename}" included in bundle "${fileName}".`);
          }
        }
      }
    }
  };
};
