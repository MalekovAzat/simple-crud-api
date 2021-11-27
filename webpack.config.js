const path = require("path/posix");

module.exports = {
  entry: "./src/server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
  },
  target: "node",
};
