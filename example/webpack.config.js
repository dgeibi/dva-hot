const webpack = require('webpack')
const path = require('path')
const fs = require('fs-extra')

const root = __dirname
const dist = path.join(root, 'public')
const dvaHotDir = path.join(__dirname, '../index.js')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: path.join(root, './index.js'),
  output: {
    path: dist,
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      'dva-hot': dvaHotDir,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime'],
          babelrc: false,
        },
        include: [root, dvaHotDir],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: dist,
    hot: true,
    hotOnly: true,
    before(app) {
      fs.ensureDirSync(path.join(root, 'component'))
      fs.ensureDirSync(path.join(root, 'models'))

      const writeFiles = () => {
        fs.writeFileSync(
          path.join(root, 'component/RandomNum.js'),
          require('./resources/component/RandomNum')()
        )

        fs.writeFileSync(
          path.join(root, 'models/one.js'),
          require('./resources/models/one')()
        )

        fs.writeFileSync(
          path.join(root, 'models/two.js'),
          require('./resources/models/two')()
        )
      }
      writeFiles()
      app.get('/', (req, res, next) => {
        next()
        setTimeout(writeFiles, 1000)
      })
    },
  },
}
