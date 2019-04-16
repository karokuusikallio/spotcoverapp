const path = require("path");

module.exports = {
  entry: "./src/app.jsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [{
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        use: [{
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./public",
    hot: true
  }
};