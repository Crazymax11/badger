(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = undefined;
exports.default = createApp;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(2);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _badger = __webpack_require__(3);

var _badger2 = _interopRequireDefault(_badger);

var _eslintErrors = __webpack_require__(5);

var _eslintErrors2 = _interopRequireDefault(_eslintErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApp(port, store, typesMap) {
  const app = (0, _express2.default)();
  app.use(_bodyParser2.default.json());
  app.get('/badges/:badgeType/:project', async (req, res) => {
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    const lastValue = await store.getLast(project, badgeType);
    console.log('lastV', lastValue);
    const badgeHandler = typesMap[badgeType];
    const badgeData = badgeHandler(lastValue.status);
    const badge = (0, _badger2.default)(badgeData);
    console.log(badge);
    return res.send(badge);
  });

  app.post('/badges/:badgeType/:project', async (req, res) => {
    const status = req.body.status;
    const badgeType = req.params.badgeType;
    const project = req.params.project;
    if (typeof status === 'undefined') {
      return res.status(400).send('lol kek cheburek');
    }

    const badgeHandler = typesMap[req.params.badgeType];
    console.log(badgeHandler);
    await store.store(project, badgeType, status, Date.now());
    if (badgeHandler) {
      const meta = badgeHandler(status);
      const badge = (0, _badger2.default)(meta);
      return res.send(badge);
    }
    return res.status(400).json(Object.keys(typesMap));
  });

  app.get('/', (req, res) => {
    const badgesSections = Object.values(typesMap).map(badgeCreator => {
      const examples = badgeCreator.examples.map(example => `<img src="${(0, _badger2.default)(badgeCreator.create(example))}">`);
      return `
        <section>
          <h3>
            ${badgeCreator.name}
          </h3>
          <div>
            <span> ${badgeCreator.description} </span>
            ${examples.join('')}
          </div>
        </section>
      `;
    });

    const html = `
      <html>
        <head>
        </head>
        <body>
          ${badgesSections.join('')}
        </body>
      </html>
    `;
    res.send(html);
  });

  app.listen(port, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('started');
  });

  return app;
}


const templates = {
  'eslint-errors': _eslintErrors2.default
};

exports.templates = templates;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(4);

function getLink(meta) {
    return `https://img.shields.io/badge/${meta.subject.replace('-', '--').replace('_', '__').replace(' ', '_')}-${meta.status}-${meta.color}.svg`;
}

module.exports = getLink;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


const creator = {
  name: 'eslint-errors',
  create(status) {
    const errors = Number(status);
    if (errors > 0) {
      return {
        color: 'red',
        status,
        subject: 'eslint-errros'
      };
    }

    return {
      color: 'green',
      subject: 'eslint-errors',
      status: 'clean'
    };
  },
  examples: ['0', '1', '10', '20', '100', '999', 'none'],
  description: 'badge to show count of eslint errors in your project'
};
exports.default = creator;

/***/ })
/******/ ]);
});