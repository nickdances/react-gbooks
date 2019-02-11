'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Ensure environment variables are read.
require('../config/env');


const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const DEFAULT_PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0';

const config = configFactory('development');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;
const urls = prepareUrls(protocol, HOST, DEFAULT_PORT);
// Create a webpack compiler that is configured with custom messages.
const compiler = createCompiler(webpack, config, appName, urls);
// Load proxy config
const proxySetting = require(paths.appPackageJson).proxy;
const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
// Serve webpack assets generated by the compiler over a web server.
const serverConfig = createDevServerConfig(
  proxyConfig,
  urls.lanUrlForConfig
);
const devServer = new WebpackDevServer(compiler, serverConfig);
// Launch WebpackDevServer.
devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  if (isInteractive) {
    clearConsole();
  }
  console.log('Starting the development server...\n');
  openBrowser(urls.localUrlForBrowser);
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});