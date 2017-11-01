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

var _levelup = __webpack_require__(1);

var _levelup2 = _interopRequireDefault(_levelup);

var _leveldown = __webpack_require__(2);

var _leveldown2 = _interopRequireDefault(_leveldown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LeveldownStore {
  constructor(dbpath) {
    this.dbpath = dbpath;
    this.db = (0, _levelup2.default)((0, _leveldown2.default)(dbpath));
  }

  /**
   * Stores record to levelDb
   * 
   * @param {Project} project
   * @param {Subject} subject
   * @param {Status} status
   * @param {Time} time
   */
  async store(project, subject, status, time) {
    if (typeof time !== 'number') {
      throw new Error('time must be a number');
    }

    if (typeof status !== 'string') {
      throw new Error('status must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    const key = getKey(project, subject);
    const history = await getFromLevelDB(this.db, key);

    history.push({
      status,
      time
    });

    await putToLevelDB(this.db, key, history);

    return {
      subject,
      status
    };
  }

  /**
   * Get last value from LevelDb
   * 
   * @param {Project} project 
   * @param {Subject} subject 
   */
  async getLast(project, subject) {
    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    const key = getKey(project, subject);
    const history = await getFromLevelDB(this.db, key);
    const record = history.slice(-1)[0];

    if (typeof record === 'undefined') {
      return {
        status: 'none',
        subject
      };
    }

    return {
      status: record.status,
      subject
    };
  }

  /**
   * Open levelDB
   */
  open() {
    return this.db.open();
  }

  /**
   * Close levelDB
   */
  close() {
    return this.db.close();
  }

  /**
   * Get status of db
   * @param {Project} project
   * @param {Subject} subject
   */
  getStatus(project, subject) {
    return getDbStatus(this.db, project, subject);
  }
}

/**
 * Constructs key for levelDb from project and subject
 * 
 * @param {Project} project 
 * @param {Subject} subject 
 * @returns {string} levelDb key
 */
function getKey(project, subject) {
  return `${project}---${subject}`;
}

function parseKey(key) {
  const [project, subject] = key.split('---');
  return {
    project,
    subject
  };
}

function getDbStatus(db, project, subject) {
  let records = 0;
  const projectsSet = new Set();
  const subjectsSet = new Set();
  return new Promise(resolve => {
    db.createReadStream().on('data', data => {
      const { subject: dataSubject, project: dataProject } = parseKey(String(data.key));
      if (project && project !== dataProject) {
        return;
      }

      if (subject && subject !== dataSubject) {
        return;
      }

      projectsSet.add(dataProject);
      subjectsSet.add(dataSubject);
      records += JSON.parse(data.value).length;
    }).on('error', err => resolve({
      status: err.toString(),
      projects: 0,
      subjects: 0,
      records: 0
    })).on('end', () => resolve({
      status: 'ok',
      projects: projectsSet.size,
      subjects: subjectsSet.size,
      records
    }));
  });
}

/**
 * Get key from levelDB. If any error, [] will be returned
 * @param {leveldb} db leveldb instance
 * @param {string} key leveldb key
 */
function getFromLevelDB(db, key) {
  return db.get(key).catch(() => '[]').then(rawValue => JSON.parse(rawValue));
}

/**
 * 
 * @param {levelDb} db levelDB instance
 * @param {key} key levelDB key
 * @param {any} value value will be JSON.stringified
 */
function putToLevelDB(db, key, value) {
  return db.put(key, JSON.stringify(value));
}

exports.default = LeveldownStore;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("levelup");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("leveldown");

/***/ })
/******/ ]);
});