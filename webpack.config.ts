import {Configuration} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './src/index.ts',
    index2: './src/index2.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      scriptLoading: 'blocking',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};

export default config;
