module.exports = ({ blockPattern } = {}) => {
  if (!(blockPattern instanceof RegExp || typeof blockPattern === 'string')) {
    throw new Error("'blockPattern' should be a string or regular expression.");
  }
  const shouldBlock = fileName => {
    if (blockPattern instanceof RegExp) {
      return blockPattern.test(fileName);
    }
    return fileName.includes(blockPattern);
  };
  return {
    name: 'rollup-plugin-block',
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (bundle[fileName].type !== 'chunk') {
          continue;
        }
        for (const moduleFileName in bundle[fileName].modules) {
          if (
            bundle[fileName].modules[moduleFileName].renderedLength &&
            shouldBlock(moduleFileName)
          ) {
            this.error(
              new Error(`"${moduleFileName}" included in bundle "${fileName}".`)
            );
          }
        }
      }
    }
  };
};
