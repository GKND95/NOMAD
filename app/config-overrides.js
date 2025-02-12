const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
  libraryName: 'antd',
  libraryDirectory: 'es',
  style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      '@heading-color': '#333',
      '@text-color': '#333'
    },
  })
);