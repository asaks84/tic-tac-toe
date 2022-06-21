const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: [ 
      './src/core.js',
      './src/script.js'
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      title: 'tic-tac-toe',
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  }
  
};