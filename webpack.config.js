const path = require('path');

module.exports = {
  entry: './js/src/main.js',
  cache: true,
  devtool: 'source-map',
  output: {
    filename: 'main.js',
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
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
        }
      }
    }
  }
};
