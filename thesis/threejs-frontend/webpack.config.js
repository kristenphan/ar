const path = require("path");

module.exports = {
  mode: "development",
  entry: "/src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    static: "./"
  },
  // Give performance warnings when entry point and output assets execeed a file size limit in bytes
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000
  }
}