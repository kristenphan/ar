const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "/src/index.js", 
    waterme: "/src/waterme.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
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