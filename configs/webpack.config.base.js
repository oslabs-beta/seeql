import path from 'path';
import webpack from 'webpack';
import { dependencies } from '../package.json';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default {
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } }
              ],
              '@babel/preset-typescript',
              '@babel/preset-react'
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              'react-hot-loader/babel'
            ]
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.NamedModulesPlugin()
  ]
};
