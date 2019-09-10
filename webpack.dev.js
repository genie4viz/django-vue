const config = require("./webpack.config.js");
const path = require("path");
const BundleTracker = require("webpack-bundle-tracker");

const STATIC_ROOT = path.resolve(__dirname, "hikster", "static");
const SRC_PATH = path.resolve(STATIC_ROOT, "src");
const DIST_PATH = path.resolve(STATIC_ROOT, "local", "dist");

config.mode = "development";
config.output.path = DIST_PATH;

config.plugins = [
  new BundleTracker({ filename: "./webpack-stats-dev.json" })
];

config.resolve.alias.vue = "vue/dist/vue.js";

module.exports = config;
