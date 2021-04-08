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

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("var lat = 20.056117;\nvar lng = -98.761509;\nvar apiKey = \"AAPKf94ed90ce654499d92557d52123461a4r3rEGC5hDfH50MLuTIJNqTryH4dWxATZtPcCzzkUJtS_EfUlxC90laXR_-ZLJctS\";\nvar basemapEnum = \"ArcGIS:Navigation\";\nvar marker;\nvar map = L.map(\"mapa\", {\n  minZoom: 2\n}).setView([lat, lng], 15);\nL.esri.Vector.vectorBasemapLayer(basemapEnum, {\n  apiKey: apiKey\n}).addTo(map);\nvar searchControl = L.esri.Geocoding.geosearch({\n  position: \"topright\",\n  placeholder: \"Escribe el lugar en donde se lleva el meeti\",\n  useMapBounds: false,\n  providers: [L.esri.Geocoding.arcgisOnlineProvider({\n    apikey: apiKey,\n    nearby: {\n      lat: lat,\n      lng: lng\n    }\n  })]\n}).addTo(map);\nvar geocoder = L.esri.Geocoding.geocodeService({\n  apikey: apiKey\n});\nvar results = L.layerGroup().addTo(map);\nsearchControl.on(\"results\", function (data) {\n  results.clearLayers();\n  console.log(searchControl);\n\n  for (var i = data.results.length - 1; i >= 0; i--) {\n    marker = L.marker(data.results[i].latlng, {\n      draggable: true,\n      autoPan: true\n    });\n    marker.bindPopup(\"<b>\".concat(data.results[i].properties.PlaceName, \"</b><p>\").concat(data.results[i].properties.LongLabel, \"</p>\"));\n    results.addLayer(marker);\n    marker.openPopup();\n    mover();\n  }\n});\n\nfunction mover() {\n  marker.on(\"moveend\", function (e) {\n    results.clearLayers();\n    marker = e.target;\n    var posicion = marker.getLatLng();\n    console.log(posicion);\n    geocoder.reverse().latlng(posicion).run(function (error, result) {\n      if (error) return;\n      marker = L.marker(posicion, {\n        draggable: true,\n        autoPan: true\n      });\n      console.log(result);\n      marker.bindPopup(\"<b>\".concat(result.address.PlaceName, \"</b><p>\").concat(result.address.LongLabel, \"</p>\"));\n      results.addLayer(marker);\n      marker.openPopup();\n      mover();\n    });\n  });\n}\n\n//# sourceURL=webpack://MeetiUp/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;