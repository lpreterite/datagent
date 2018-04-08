"use strict";

require("babel-polyfill");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

global.assert = chai.assert;
//# sourceMappingURL=setup.js.map