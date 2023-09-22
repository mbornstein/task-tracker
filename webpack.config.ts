import path from "path";
import { Configuration } from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from 'html-webpack-plugin';


const config: Configuration = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.(sass|less|css|scss)$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "/src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};

export default config;
