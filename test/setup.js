/**
 * setup.js is bootstrap in mocha-webpack, must use current nodejs verstion supported script code.
 * The way is not support ES6~7 and higher ECMAscript version.
 */

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

global.assert = chai.assert;
global.axios = require('axios');
global.MockAdapter = require('axios-mock-adapter');
