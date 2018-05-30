(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dataplumber"] = factory();
	else
		root["dataplumber"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isDef; });
/* unused harmony export isArray */
/* unused harmony export isNumber */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return defaults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compose; });
/* harmony export (immutable) */ __webpack_exports__["b"] = convert;
/* unused harmony export formatField */
/* unused harmony export mapReceiveHook */
/* unused harmony export mapSendHook */
/* unused harmony export mapHooks */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Method_class__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Hooks_class__ = __webpack_require__(2);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var isNew = function isNew(data) {
    return !isDef(data.id);
};
var getURL = function getURL(url, id, emulateIdKey) {
    return emulateIdKey ? url : url + (isDef(id) ? '/' + id : '');
};
var isDef = function isDef(val) {
    return typeof val !== 'undefined';
};
var isArray = function isArray(val) {
    return val.constructor === Array;
};
var isNumber = function isNumber(val) {
    return val.constructor === Number;
};
var defaults = function defaults(obj) {
    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var merge = function merge(defaults, obj) {
        return defaults.constructor === Array ? defaults.concat(obj) : Object.assign(defaults, obj);
    };
    return isDef(obj) ? merge(defaults, obj) : defaults;
};

var compose = function compose() {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
        list[_key] = arguments[_key];
    }

    return function (acc) {
        return list.reduce(function (acc, fn) {
            return acc.then(fn);
        }, Promise.resolve(acc));
    };
};

/**
 * format code like that:
 * ```
 * {
 *   "id": { type: Number, default: null },
 *   "nickname": { type: String, default: "" },
 *   "emial": { type: String, default:"" },
 *   "password": { type: String, default:"" }
 * }
 * ```
 */
function convert() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments[1];

    options = defaults(options, { format: false });
    return function () {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [].concat(Object.keys(data), Object.keys(format));

        var result = {};
        fields.forEach(function (fieldName) {
            var fieldSet = format[fieldName];
            if (isDef(data[fieldName])) result[fieldName] = data[fieldName];
            if (options.format && isDef(fieldSet)) result[fieldName] = formatField(fieldSet.type, fieldSet.default)(data[fieldName]);
        });
        return result;
    };
}

function formatField(to, defaultVal) {
    return function (val) {
        var result = void 0;
        if (!isDef(val)) result = defaultVal;else result = to(val);
        if (defaultVal === result) return result;
        if (isNumber(result) && result === NaN) result = defaultVal;
        if (result === null) result = defaultVal;
        return result;
    };
}

function mapReceiveHook(methods, options) {
    options = defaults(options, __WEBPACK_IMPORTED_MODULE_1__classes_Hooks_class__["a" /* default */].ReceiveBehaviour);
    return mapHooks(methods, options);
}
function mapSendHook(methods, options) {
    options = defaults(options, __WEBPACK_IMPORTED_MODULE_1__classes_Hooks_class__["a" /* default */].SendBehaviour);
    return mapHooks(methods, options);
}
function mapHooks(methods) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!isDef(options.methods)) throw new Error('The options must have methods parameter in mapHooks');
    if (!isArray(options.methods)) throw new Error('The options.methods must be Array in mapHooks');
    if (!isDef(options.hooks)) throw new Error('The options must have hooks parameter in mapHooks');
    if (!isArray(options.hooks)) throw new Error('The options.hooks must be Array in mapHooks');
    var result = options.methods.map(function (hookName) {
        return _defineProperty({}, hookName, {});
    }).reduce(Object.assign);
    Object.keys(result).forEach(function (hookName) {
        result[hookName] = options.hooks.map(function (hookName) {
            return _defineProperty({}, hookName, methods);
        }).reduce(Object.assign);
    });
    return result;
}

/* harmony default export */ __webpack_exports__["c"] = ({
    isNew: isNew,
    getURL: getURL,
    isDef: isDef,
    defaults: defaults,
    convert: convert,
    compose: compose,
    mapSendHook: mapSendHook,
    mapReceiveHook: mapReceiveHook
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import compose from 'koa-compose';


/**
 * queue call function like that:
 * ```
 * (ctx, next) => {
 *   // ctx is content in all queue functions, like koa.
 *   // ctx have $model, arge, result fields
 *   // ======================================================
 *   // ctx.$model is function scope
 *   // ctx.arge is function arguments
 *   // ctx.result is this function result
 *   next();
 * }
 * ```
 * 
 * run function return Promise data pattern like that:
 * ```
 * let err, result;
 * [err, result] = Queue.run($model, args, queues);
 * if(err) throw err;
 * console.log(result);
 * ```
 * more detail look test file.
 */

var Method = function () {
    function Method() {
        _classCallCheck(this, Method);
    }

    _createClass(Method, null, [{
        key: 'generate',
        value: function generate(queues) {
            var queue = __WEBPACK_IMPORTED_MODULE_0__utils___["a" /* compose */].apply(undefined, _toConsumableArray(queues));
            return function (args) {
                var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                ctx = Object.assign(ctx, { args: args });
                return new Promise(function (resolve, reject) {
                    queue(ctx).then(function (ctx) {
                        return resolve(ctx.result);
                    }).catch(reject);
                });
            };
        }
    }, {
        key: 'concat',
        value: function concat() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return args.map(function (arg) {
                return Object(__WEBPACK_IMPORTED_MODULE_0__utils___["d" /* defaults */])(arg, []);
            }).reduce(function (x, y) {
                return x.concat(y);
            });
        }
    }]);

    return Method;
}();

/* harmony default export */ __webpack_exports__["a"] = (Method);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hooks = function () {
    function Hooks() {
        _classCallCheck(this, Hooks);

        this._map = new Map();
    }

    _createClass(Hooks, [{
        key: 'addHooks',
        value: function addHooks(key, operations) {
            return this._map.set(key, operations);
        }
    }, {
        key: 'getHooks',
        value: function getHooks(key) {
            return this._map.get(key);
        }
    }, {
        key: 'each',
        value: function each(fn) {
            return this._map.forEach(fn);
        }
    }, {
        key: 'length',
        get: function get() {
            return this._map.size;
        }
    }], [{
        key: 'parse',
        value: function parse(_ref) {
            var method = _ref.method,
                hook = _ref.hook;
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'method';

            var result = method + ':' + hook;
            if (type === 'behaviour') {
                if (Hooks.isReceiveBehaviour(method, hook)) result = 'receive';
                if (Hooks.isSendBehaviour(method, hook)) result = 'send';
            }
            return result;
        }
    }, {
        key: 'isReceiveBehaviour',
        value: function isReceiveBehaviour(method, hook) {
            if (typeof method !== 'string') throw new TypeError('The method must be string in isReceiveBehaviour()');
            if (typeof hook !== 'string') throw new TypeError('The hook must be string in isReceiveBehaviour()');
            return Hooks.ReceiveBehaviour.methods.indexOf(method) > -1 && Hooks.ReceiveBehaviour.hooks.indexOf(hook) > -1;
        }
    }, {
        key: 'isSendBehaviour',
        value: function isSendBehaviour(method, hook) {
            if (typeof method !== 'string') throw new TypeError('The method must be string in isSendBehaviour()');
            if (typeof hook !== 'string') throw new TypeError('The hook must be string in isSendBehaviour()');
            return Hooks.SendBehaviour.methods.indexOf(method) > -1 && Hooks.SendBehaviour.hooks.indexOf(hook) > -1;
        }
    }, {
        key: 'ReceiveBehaviour',
        get: function get() {
            return {
                methods: ['fetch', 'find'],
                hooks: ['after']
            };
        }
    }, {
        key: 'SendBehaviour',
        get: function get() {
            return {
                methods: ['save'],
                hooks: ['before']
            };
        }
    }]);

    return Hooks;
}();

/* harmony default export */ __webpack_exports__["a"] = (Hooks);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Remote_class__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils___ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Contact = function () {
    function Contact() {
        _classCallCheck(this, Contact);

        this._remotes = {};
        this._default_remote = "";
    }

    _createClass(Contact, [{
        key: 'remote',
        value: function remote() {
            var name = arguments.length <= 0 ? undefined : arguments[0],
                remote = arguments.length <= 1 ? undefined : arguments[1],
                opts = Object(__WEBPACK_IMPORTED_MODULE_1__utils___["d" /* defaults */])(arguments.length <= 2 ? undefined : arguments[2], { default: false });
            if (arguments.length >= 2) {
                // set remote
                if (typeof name !== 'string') throw new TypeError('The first arguments must be String');
                if (remote.constructor !== __WEBPACK_IMPORTED_MODULE_0__Remote_class__["a" /* default */]) throw new TypeError('The second arguments must be Remote');
                this._remotes[name] = remote;
                if (opts.default || this.length == 1) this.default(name);
            } else {
                name = name ? name : this._default_remote;
                if (!this.has(name)) throw new RangeError('Remote does not exist ' + name + ' in remote()');
                // get remote
                remote = this._remotes[name];
                return remote;
            }
        }
    }, {
        key: 'default',
        value: function _default(name) {
            if (typeof name !== 'string') throw new TypeError('The name must be string in default()');
            if (!this.has(name)) throw new RangeError('Remote does not exist ' + name + ' in default()');
            this._default_remote = name;
        }
    }, {
        key: 'has',
        value: function has(name) {
            return Object.keys(this._remotes).indexOf(name) !== -1;
        }
    }, {
        key: 'length',
        get: function get() {
            return Object.keys(this._remotes).length;
        }
    }]);

    return Contact;
}();

/* harmony default export */ __webpack_exports__["a"] = (Contact);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Remote = function () {
    function Remote(options) {
        _classCallCheck(this, Remote);

        this._origin = options.origin;
    }

    _createClass(Remote, [{
        key: 'get',
        value: function get(url, params) {
            return this.sync({
                url: url,
                method: 'GET',
                params: params
            });
        }
    }, {
        key: 'post',
        value: function post(url, data) {
            return this.sync({
                method: 'POST',
                url: url,
                data: data
            });
        }
    }, {
        key: 'put',
        value: function put(url, data) {
            return this.sync({
                method: 'PUT',
                url: url,
                data: data
            });
        }
    }, {
        key: 'patch',
        value: function patch(url, data) {
            return this.sync({
                method: 'PATCH',
                url: url,
                data: data
            });
        }
    }, {
        key: 'delete',
        value: function _delete(url, data) {
            return this.sync({
                method: 'DELETE',
                url: url,
                data: data
            });
        }
    }, {
        key: 'sync',
        value: function sync(options) {
            return this._origin(options);
        }
    }, {
        key: 'origin',
        get: function get() {
            return this._origin;
        }
    }]);

    return Remote;
}();

/* harmony default export */ __webpack_exports__["a"] = (Remote);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DataPlumber__ = __webpack_require__(6);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__DataPlumber__["a" /* default */]);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ModelFactory */
/* unused harmony export ContactFactory */
/* unused harmony export HooksFactory */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Model_class__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Hooks_class__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_Contact_class__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_Remote_class__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_Schema_class__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__classes_Method_class__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }










function ModelFactory(options) {
    var schema = new __WEBPACK_IMPORTED_MODULE_5__classes_Schema_class__["a" /* default */](options.fields);
    var methods = _extends({
        'fetch': __WEBPACK_IMPORTED_MODULE_1__classes_Model_class__["a" /* default */].prototype.fetch,
        'find': __WEBPACK_IMPORTED_MODULE_1__classes_Model_class__["a" /* default */].prototype.find,
        'save': __WEBPACK_IMPORTED_MODULE_1__classes_Model_class__["a" /* default */].prototype.save,
        'delete': __WEBPACK_IMPORTED_MODULE_1__classes_Model_class__["a" /* default */].prototype.delete
    }, options.methods);
    //RichModel

    var RichModel = function (_Model) {
        _inherits(RichModel, _Model);

        function RichModel(opts) {
            _classCallCheck(this, RichModel);

            opts = __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].defaults(opts);
            opts.name = options.name;

            var _this = _possibleConstructorReturn(this, (RichModel.__proto__ || Object.getPrototypeOf(RichModel)).call(this, opts));

            _this.initHooks(options.hooks);
            return _this;
        }

        _createClass(RichModel, [{
            key: 'initHooks',
            value: function initHooks(options) {
                this._hooks = HooksFactory(options);
            }
        }, {
            key: 'schema',
            get: function get() {
                return schema;
            }
        }], [{
            key: 'schema',
            get: function get() {
                return schema;
            }
        }]);

        return RichModel;
    }(__WEBPACK_IMPORTED_MODULE_1__classes_Model_class__["a" /* default */]);

    Object.keys(methods).forEach(function (methodName) {
        // all hook action magic in here.
        RichModel.prototype[methodName] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var opts = __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].defaults(args[args.length - 1]);
            var hooks = __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].defaults(opts.hooks, { before: [], after: [] });

            before = __WEBPACK_IMPORTED_MODULE_6__classes_Method_class__["a" /* default */].concat(hooks.before, this._hooks.getHooks(methodName + '::before'));
            after = __WEBPACK_IMPORTED_MODULE_6__classes_Method_class__["a" /* default */].concat(hooks.after, this._hooks.getHooks(methodName + '::after'));

            var method = function method(ctx) {
                return methods[methodName].apply(ctx.scope, ctx.args).then(function (data) {
                    ctx.hook = 'after';
                    ctx.result = data;
                    return Promise.resolve(ctx);
                });
            };
            var ctx = { scope: this, method: methodName, hook: 'before' };

            return __WEBPACK_IMPORTED_MODULE_6__classes_Method_class__["a" /* default */].generate([].concat(_toConsumableArray(before), [method], _toConsumableArray(after)))(args, ctx);
        };
    });

    return RichModel;
}

function ContactFactory() {
    var remotes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';

    var contact = new __WEBPACK_IMPORTED_MODULE_3__classes_Contact_class__["a" /* default */]();
    Object.keys(remotes).forEach(function (remoteName, index) {
        contact.remote(remoteName, new __WEBPACK_IMPORTED_MODULE_4__classes_Remote_class__["a" /* default */]({ origin: remotes[remoteName] }), { default: index == 0 });
    });
    return contact;
}

function HooksFactory(options) {
    var hooks = new __WEBPACK_IMPORTED_MODULE_2__classes_Hooks_class__["a" /* default */]();
    //解析hooks的逻辑，并添加hook记录

    Object.keys(__WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].defaults(options)).forEach(function (hookName) {
        var hook = options[hookName];
        Object.keys(hook).forEach(function (aboutName) {
            hooks.addHooks(hookName + '::' + aboutName, hook[aboutName]);
        });
    });

    return hooks;
}

var DataPlumber = {
    Contact: ContactFactory,
    Model: ModelFactory,
    Hooks: HooksFactory,
    Schema: __WEBPACK_IMPORTED_MODULE_5__classes_Schema_class__["a" /* default */],
    mapReceiveHook: __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].mapReceiveHook,
    mapSendHook: __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */].mapSendHook,
    operations: __WEBPACK_IMPORTED_MODULE_0__utils___["c" /* default */]
};

/* harmony default export */ __webpack_exports__["a"] = (DataPlumber);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Contact_class__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Model = function () {
    function Model(options) {
        _classCallCheck(this, Model);

        var name = this._name = options.name;
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__utils___["f" /* isDef */])(name) || typeof name != 'string') {
            throw new Error('options.name must be string in Model');
        }
        this._url = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["f" /* isDef */])(options.url) ? options.url : '/' + name;
        if (!Object(__WEBPACK_IMPORTED_MODULE_0__utils___["f" /* isDef */])(options.contact) || options.contact.constructor != __WEBPACK_IMPORTED_MODULE_1__Contact_class__["a" /* default */]) {
            throw new Error('options.contact must be Contact class in Model');
        }
        this._contact = options.contact;
        this._emulateIdKey = typeof options.emulateIdKey === 'undefined' ? false : options.emulateIdKey;
    }

    _createClass(Model, [{
        key: 'fetch',
        value: function fetch(params, opts) {
            var _defaults = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["d" /* defaults */])(opts),
                origin = _defaults.origin;

            return this.remote(origin).get(this._url, params);
        }
    }, {
        key: 'find',
        value: function find(id, opts) {
            var _defaults2 = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["d" /* defaults */])(opts),
                origin = _defaults2.origin;

            var params = this._emulateIdKey ? _defineProperty({}, this._emulateIdKey, id) : {};
            return this.remote(origin).get(Object(__WEBPACK_IMPORTED_MODULE_0__utils___["e" /* getURL */])(this._url, id, this._emulateIdKey), params);
        }
    }, {
        key: 'save',
        value: function save(data, opts) {
            var _defaults3 = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["d" /* defaults */])(opts),
                origin = _defaults3.origin;

            var id = data.id;

            var url = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["e" /* getURL */])(this._url, id, this._emulateIdKey);
            return this.remote(origin)[Object(__WEBPACK_IMPORTED_MODULE_0__utils___["g" /* isNew */])(data) ? 'post' : 'put'](url, data);
        }
    }, {
        key: 'delete',
        value: function _delete(id, opts) {
            var _defaults4 = Object(__WEBPACK_IMPORTED_MODULE_0__utils___["d" /* defaults */])(opts),
                origin = _defaults4.origin;

            var params = this._emulateIdKey ? _defineProperty({}, this._emulateIdKey, id) : {};
            return this.remote(origin).delete(Object(__WEBPACK_IMPORTED_MODULE_0__utils___["e" /* getURL */])(this._url, id, this._emulateIdKey), params);
        }
    }, {
        key: 'remote',
        value: function remote(name) {
            return this._contact.remote(name);
        }
    }, {
        key: 'contact',
        get: function get() {
            return this._contact;
        }
    }]);

    return Model;
}();

/* harmony default export */ __webpack_exports__["a"] = (Model);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export format */
/* unused harmony export filter */
/* unused harmony export schema */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils___ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _format = function _format(data, fieldSet) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__utils___["b" /* convert */])(fieldSet, { format: true })(data);
};

var _filter = function _filter(data, fields) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__utils___["b" /* convert */])()(data, fields);
};

var schema = function schema(fieldSet) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__utils___["b" /* convert */])(fieldSet, { format: true })({}, Object.keys(fieldSet));
};

var Schema = function () {
    function Schema(fieldSet) {
        _classCallCheck(this, Schema);

        this._fieldSet = fieldSet;
    }

    _createClass(Schema, [{
        key: "format",
        value: function format(data) {
            return _format(data, this._fieldSet);
        }
    }, {
        key: "filter",
        value: function filter(data) {
            var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object.keys(this._fieldSet);

            return _filter(data, fields);
        }
    }, {
        key: "default",
        value: function _default() {
            return schema(this._fieldSet);
        }
    }, {
        key: "fieldSet",
        get: function get() {
            return this._fieldSet;
        }

        // static

    }], [{
        key: "format",
        value: function format(data, fieldSet) {
            return _format(data, fieldSet);
        }
    }, {
        key: "filter",
        value: function filter(data, fields) {
            return _filter(data, fields);
        }
    }, {
        key: "default",
        value: function _default(fieldSet) {
            return schema(fieldSet);
        }
    }]);

    return Schema;
}();

/* harmony default export */ __webpack_exports__["a"] = (Schema);

/***/ })
/******/ ]);
});
//# sourceMappingURL=dataplumber.js.map