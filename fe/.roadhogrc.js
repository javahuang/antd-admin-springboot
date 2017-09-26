const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",
  publicPath: `/${version}/`,
  outputPath: `./dist/${version}`,
  "extraBabelPlugins": ["transform-runtime"],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        ["import", {
          "libraryName": "antd",
          "style": true
        }]
      ],
      "proxy": [{
        "context": ['/api/v1', '/common'],
        "target": "http://localhost:7000/",
        "changeOrigin": true,
        "pathRewrite": { "^/api/v1": "" }
      }],
    },
    "production": {
      "extraBabelPlugins": [
        ["import", { "libraryName": "antd", "style": true }]
      ]
    }
  },
  "dllPlugin": {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    inclue: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
