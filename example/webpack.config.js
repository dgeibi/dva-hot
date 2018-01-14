const webpack = require('webpack')
const path = require('path')
const fs = require('fs-extra')

const root = __dirname
const dist = path.join(root, 'public')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: path.join(root, './index.js'),
  output: {
    path: dist,
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      'dva-hot': path.join(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime'],
              babelrc: false,
            },
          },
        ],
        include: [root],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
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
      }
      writeFiles()
      app.get('/', (req, res, next) => {
        next()
        setTimeout(writeFiles, 1000)
      })
    },
  },
}
