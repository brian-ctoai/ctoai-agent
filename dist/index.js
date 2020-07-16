module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(87);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(379);
const github = __webpack_require__(538);
const fetch = __webpack_require__(443).fetchUrl;

try {
  const stage = core.getInput('stage');
  const status = core.getInput('status');
  const team_id = core.getInput('team_id');
  const custom = core.getInput('custom');
  const change_id = core.getInput('change_id');
  const pipeline_id = core.getInput('pipeline_id');
  console.log(stage,status,team_id,custom,change_id,pipeline_id);
  fetch("http://www.example.com", function(e,m,b) {
    console.log("body.toString()");
  });

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

} catch (error) {
  core.setFailed(error.message);
}


/***/ }),

/***/ 379:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 443:
/***/ (function(module) {

module.exports = eval("require")("fetch");


/***/ }),

/***/ 538:
/***/ (function(module) {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ });