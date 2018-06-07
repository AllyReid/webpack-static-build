const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');

console.log(path.join(__dirname, 'data/project.json'));

module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      { test: /\.hbs$/, loader: 'handlebars-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin('dist', {}),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HandlebarsPlugin({
      // path to hbs entry file(s)
      entry: path.join(process.cwd(), 'src', 'html', '*.hbs'),
      // output path and filename(s). This should lie within the webpacks output-folder
      // if ommited, the input filepath stripped of its extension will be used
      output: path.join(process.cwd(), 'dist', '[name].html'),
      // // data passed to main hbs template: `main-template(data)`

      // // or add it as filepath to rebuild data on change using webpack-dev-server
      data: path.join(__dirname, 'data/project.json'),

      // globbed path to partials, where folder/filename is unique
      partials: [path.join(process.cwd(), 'html', '**', '*.hbs')],

      // register custom helpers. May be either a function or a glob-pattern
      // helpers: {
      //   nameOfHbsHelper: Function.prototype,
      //   projectHelpers: path.join(
      //     process.cwd(),
      //     'app',
      //     'helpers',
      //     '*.helper.js',
      //   ),
      // },

      // hooks
      onBeforeSetup: function(Handlebars) {},
      onBeforeAddPartials: function(Handlebars, partialsMap) {},
      onBeforeCompile: function(Handlebars, templateContent) {},
      onBeforeRender: function(Handlebars, data) {},
      onBeforeSave: function(Handlebars, resultHtml, filename) {},
      onDone: function(Handlebars, filename) {},
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.hbs',
    }),
    new WebpackMd5Hash(),
  ],
};
