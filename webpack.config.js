const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');

const hljsSupportedLanguages = [
  'javascript',
  'typescript',
  'csp',
  'cpp',
  'go',
  'java',
  'perl',
  'php',
  'python',
  'ruby',
  'scala',
  'bash',
  'shell',
  'sql',
  'yaml',
  'json',
];

function getAllPackages(dir) {
  const dirList = fs.readdirSync(dir);
  return dirList.map(function(subDir) {
    subDir = path.resolve(dir, subDir);
    const json = require(`${subDir}/package.json`);
    return json.name;
  });
}

module.exports = function(env = 'production') {
  const isProduction = env === 'production';
  return {
    mode: env,
    entry: './src/index',
    target: 'web',
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      filename: 'index.js',
      libraryTarget: isProduction ? 'umd' : undefined,
    },

    externals: isProduction
      ? [
          'react',
          'emotion',
          'react-emotion',
          'create-emotion',
          'polished',
          'prop-types',
          ...getAllPackages('../../packages'),
        ]
      : [],

    resolve: {
      extensions: ['.js', '.json', '.less', '.css', '.tsx', '.ts'],
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: '@svgr/webpack',
        },

        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          query: {
            limit: 50000,
          },
        },
      ],
    },

    plugins: (function() {
      const CleanWebpackPluginInstance = new CleanWebpackPlugin([
        path.resolve(process.cwd(), 'dist'),
      ]);

      const DefinePluginInstance = new webpack.DefinePlugin({
        __DEV__: JSON.stringify((!isProduction).toString()),
      });

      const ContextReplacementPluginInstance = new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${hljsSupportedLanguages.join('|')})$`),
      );

      return [
        CleanWebpackPluginInstance,
        DefinePluginInstance,
        ContextReplacementPluginInstance,
      ];
    })(),
  };
};