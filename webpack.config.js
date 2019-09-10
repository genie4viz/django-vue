const path = require("path");
const webpack = require("webpack");
const BundleTracker = require("webpack-bundle-tracker");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const STATIC_ROOT = path.resolve(__dirname, "hikster", "static");
const SRC_PATH = path.resolve(STATIC_ROOT, "src");
const ADMIN_SRC_PATH = path.resolve(STATIC_ROOT, "src", "admin");
const DIST_PATH = path.resolve(STATIC_ROOT, "dist");

module.exports = {
  mode: "production",
  context: __dirname,

  entry: {
    home: path.resolve(SRC_PATH, "pages", "home.js"),
    results_page: path.resolve(SRC_PATH, "pages", "results.js"),
    location_detail_page: path.resolve(SRC_PATH, "pages", "location-detail.js"),
    poi_detail_page: path.resolve(SRC_PATH, "pages", "poi-detail.js"),
    trail_detail_page: path.resolve(SRC_PATH, "pages", "trail-detail.js"),

    pagenav_component: path.resolve(SRC_PATH, "components", "pagenav.js"),
    map_component: path.resolve(SRC_PATH, "components", "map.js"),
    location_trails: path.resolve(SRC_PATH, "components", "location-trails.js"),

    // admin files
    admin_organization_page: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "organization.js"
    ),
    admin_location_list: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "location-list.js"
    ),
    admin_location_detail: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "location-detail.js"
    ),
    admin_trail_section_list: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "trail-section-list.js"
    ),
    admin_trail_section_detail: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "trail-section-detail.js"
    ),

    admin_trail_list: path.resolve(ADMIN_SRC_PATH, "pages", "trail-list.js"),
    admin_trail_detail: path.resolve(
      ADMIN_SRC_PATH,
      "pages",
      "trail-detail.js"
    ),

    admin_poi_list: path.resolve(ADMIN_SRC_PATH, "pages", "poi-list.js"),
    admin_poi_detail: path.resolve(ADMIN_SRC_PATH, "pages", "poi-detail.js")
  },

  output: {
    filename: "[name]-[hash].js",
    path: DIST_PATH
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },{
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin([DIST_PATH + "*"]),
    new BundleTracker({ filename: "./webpack-stats.json" })
  ],

  resolve: {
    modules: [SRC_PATH, "node_modules"],
    extensions: [".js", ".jsx"],
    alias: {
      vue: "vue/dist/vue.min.js",
      "@": path.resolve(SRC_PATH)
    }
  }
};
