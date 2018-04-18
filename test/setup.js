/**
 * setup.js is bootstrap in mocha-webpack, must use current nodejs verstion supported script code.
 * The way is not support ES6~7 and higher ECMAscript version.
 */

require("babel-polyfill");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

global.assert = chai.assert;
