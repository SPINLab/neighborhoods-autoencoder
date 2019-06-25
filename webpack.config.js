const path = require('path');

module.exports = {
  entry: './js/src/polygonMap.js',
  output: {
    filename: 'polygonMap.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg)$/,
        use: [{
          loader: "file-loader",
          options: {
            outputPath: 'images',
          },
        }]
      }
    ]
  }
};
