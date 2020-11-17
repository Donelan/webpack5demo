const path = require('path');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const projectPublicPath = path.resolve(__dirname, '../src');
const projectDirectory = require('./project.config');
module.exports = {
    entry: projectDirectory.reduce((acc, item) => (acc[item] = path.resolve(__dirname, `../src/${item}/index.js`), acc), {}),
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css', //使用 filename: "[contenthash].css" 启动长期缓存。根据需要添加 [name]。
            ignoreOrder: true, //对于通过使用 scoping 或命名约定来解决 css order 的项目，可以通过将插件的 ignoreOrder 选项设置为 true 来禁用 css order 警告
        }),
        ...projectDirectory.reduce((acc, item) => (acc.push(new HtmlWebpackPlugin({
            title: item + 'client',
            filename: `${item}.html`,
            chunks: ["manifest", "vendor", item],
            publicPath: '.',
            template: 'index.ejs',
            inject: false,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        })), acc), []),
        // new CompressionPlugin({
        //     "filename": "[path].gz[query]",
        //     "test": new RegExp("\\.(js|css)$"),
        //     "threshold": 500,
        //     "minRatio": 0.8,
        //     "algorithm": "gzip"
        // }), //开启gzip 压缩
        new VueLoaderPlugin()
    ],
    output: {
        filename: 'static/js/[name].[contenthash].js',
        chunkFilename: 'static/js/[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist/'),
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(), //压缩插件
        ],
        minimize: true,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                reuseExistingChunk: false
            }
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, '../src'),
            "@common": path.resolve(__dirname, '../src/common')
        },
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s?css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader",
                    "sass-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[contenthash].[ext]',
                        outputPath: (name, fullPath) => (fullPath.replace(projectPublicPath, '').split('\\')[1] + '/static/image/' + name)
                    }
                }
            }
        ],
    },
};