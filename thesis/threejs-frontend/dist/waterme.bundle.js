/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/waterme.js":
/*!************************!*\
  !*** ./src/waterme.js ***!
  \************************/
/***/ (() => {

eval("// Wait until html finishes loading, \n// then invoke a lambda function to write a new watering record in backend database\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  // If button Submit is clicked, add a new watering record to backend database\n  document.getElementById(\"button-submit\").addEventListener(\"click\", function () {\n    console.log(\"water me button submit clicked\");\n\n    // Obtain the plant status and write it to a database\n    // Radio button \"Good\" is checked by default\n    var radioButtonGroup = document.getElementsByName(\"plant-status\");\n    var checkedRadio = Array.from(radioButtonGroup).find(function (radio) {\n      return radio.checked;\n    });\n    var plantStatus = checkedRadio.value;\n\n    // TODO: Call to lambda to write a new watering record to database\n    var plantId = 1;\n    alert(\"Recorded html form: plantId = \" + plantId + \"; plantStatus = \" + plantStatus);\n\n    // Return to main dashboard\n    window.location.href = \"./index.html\";\n  });\n});\n\n//# sourceURL=webpack://threejs-frontend/./src/waterme.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/waterme.js"]();
/******/ 	
/******/ })()
;