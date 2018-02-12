const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const tailwindcss = require('tailwindcss')
const glob = require('glob')
const path = require('path')

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || []
  }
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1, minimize: isProd } },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    // Clean the 'dist' folder in production
    isProd && new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    // Scan all the files in the 'src' folder and remove
    // unused class names in production
    isProd && new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src') + '/**/*.+(js|html)'),
      extractors: [
        {
          extractor: TailwindExtractor,
          // Specify the file extensions to include when scanning for
          // class names.
          extensions: ['html', 'js']
        }
      ]
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    isProd && new webpack.optimize.UglifyJsPlugin()
  ].filter(Boolean)
}
