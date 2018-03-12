const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'styles.css',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true } },
            { loader: 'resolve-url-loader' },
            { loader: 'postcss-loader', options: { sourceMap: true } }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
}
