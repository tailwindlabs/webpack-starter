const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/styles.css',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 }
          },
          {
            loader: "postcss-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    })
  ]
};