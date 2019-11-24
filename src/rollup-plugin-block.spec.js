const rollup = require('rollup');
const RollupPluginBlock = require('./rollup-plugin-block');

const entryFile = 'entry.js';

function buildFakeFile(id, contents) {
  return {
    resolveId(_id) {
      if (_id === id) {
        return { id };
      }
      return null;
    },
    load(_id) {
      if (_id === id) {
        return contents;
      }
      return null;
    }
  };
}

async function doBuild({ config, files }) {
  const bundle = await rollup.rollup({
    input: entryFile,
    onwarn: e => {
      throw new Error(e);
    },
    plugins: [
      RollupPluginBlock(config),
      ...Object.keys(files).map(fileName =>
        buildFakeFile(
          fileName,
          files[fileName] + `\nconsole.log("${fileName}")`
        )
      )
    ]
  });
  return bundle.generate({ format: 'cjs' });
}

describe('RollupPluginBlock', () => {
  it('case 1', async () => {
    await expect(
      doBuild({
        config: undefined,
        files: {
          [entryFile]: `
          import 'a';
        `,
          a: ``
        }
      })
    ).rejects.toMatchObject({
      message: `'blockPattern' should be a string or regular expression.`
    });
  });

  it('case 2', async () => {
    await doBuild({
      config: {
        blockPattern: 'block'
      },
      files: {
        [entryFile]: `
          import 'a';
        `,
        a: ``
      }
    });
  });

  it('case 3', async () => {
    await expect(
      doBuild({
        config: {
          blockPattern: '_block_'
        },
        files: {
          [entryFile]: `
            import 'test';
          `,
          test: `
            import '_block_';
          `,
          _block_: ``
        }
      })
    ).rejects.toMatchObject({
      message: `"_block_" included in bundle "entry.js".`
    });
  });

  it('case 4', async () => {
    await expect(
      doBuild({
        config: {
          blockPattern: /_block_/
        },
        files: {
          [entryFile]: `
            import 'test';
          `,
          test: `
            import '_block_';
          `,
          _block_: ``
        }
      })
    ).rejects.toMatchObject({
      message: `"_block_" included in bundle "entry.js".`
    });
  });
});
