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

eval("//obtener los dtaos de la vista \nvar lat = document.querySelector('#lat').value || 20.056117;\nvar lng = document.querySelector('#lng').value || -98.761509;\nvar direccionData = document.querySelector('#direccion').value || '';\nvar apiKey = \"AAPKf94ed90ce654499d92557d52123461a4r3rEGC5hDfH50MLuTIJNqTryH4dWxATZtPcCzzkUJtS_EfUlxC90laXR_-ZLJctS\";\nvar basemapEnum = \"ArcGIS:Navigation\";\nvar marker;\nvar map = L.map(\"mapa\", {\n  minZoom: 2\n}).setView([lat, lng], 15);\nL.esri.Vector.vectorBasemapLayer(basemapEnum, {\n  apiKey: apiKey\n}).addTo(map);\nvar searchControl = L.esri.Geocoding.geosearch({\n  position: \"topright\",\n  placeholder: \"Escribe el lugar en donde se lleva el meeti\",\n  useMapBounds: false,\n  providers: [L.esri.Geocoding.arcgisOnlineProvider({\n    apikey: apiKey,\n    nearby: {\n      lat: lat,\n      lng: lng\n    }\n  })]\n}).addTo(map);\nvar geocoder = L.esri.Geocoding.geocodeService({\n  apikey: apiKey\n});\nvar results = L.layerGroup().addTo(map);\nsearchControl.on(\"results\", function (data) {\n  results.clearLayers();\n\n  for (var i = data.results.length - 1; i >= 0; i--) {\n    marker = L.marker(data.results[i].latlng, {\n      draggable: true,\n      autoPan: true\n    });\n    marker.bindPopup(\"<b>\".concat(data.results[i].properties.PlaceName, \"</b><p>\").concat(data.results[i].properties.LongLabel, \"</p>\"));\n    results.addLayer(marker);\n    marker.openPopup(); //console.log(data.results[i])\n\n    var dataInfo = {\n      direccion: data.results[i].properties.ShortLabel + \", \" + data.results[i].properties.Nbrhd,\n      ciudad: data.results[i].properties.City,\n      estado: data.results[i].properties.Region,\n      pais: data.results[i].properties.Country,\n      lat: data.results[i].latlng.lat,\n      lng: data.results[i].latlng.lng\n    };\n    llenarInputs(dataInfo);\n    mover();\n  }\n}); //colocar el pin en edicion \n\nif (lat && lng) {\n  marker = L.marker([lat, lng], {\n    draggable: true,\n    autoPan: true\n  });\n  marker.bindPopup(\"<b>Ubicaci\\xF3n Actual del meeti</b><p>\".concat(direccionData, \"</p>\"));\n  results.addLayer(marker);\n  marker.openPopup();\n  mover();\n}\n\nfunction mover() {\n  marker.on(\"moveend\", function (e) {\n    results.clearLayers();\n    marker = e.target;\n    var posicion = marker.getLatLng();\n    geocoder.reverse().latlng(posicion).run(function (error, result) {\n      if (error) return;\n      marker = L.marker(posicion, {\n        draggable: true,\n        autoPan: true\n      });\n      marker.bindPopup(\"<b>\".concat(result.address.PlaceName, \"</b><p>\").concat(result.address.LongLabel, \"</p>\"));\n      results.addLayer(marker);\n      marker.openPopup(); //console.log(result.address)\n\n      var dataInfo = {\n        direccion: result.address.ShortLabel + \", \" + result.address.Neighborhood,\n        ciudad: result.address.City,\n        estado: result.address.Region,\n        pais: result.address.CountryCode,\n        lat: result.latlng.lat,\n        lng: result.latlng.lng\n      };\n      llenarInputs(dataInfo);\n      mover();\n    });\n  });\n}\n\nfunction llenarInputs(resultado) {\n  //console.log(resultado);\n  document.querySelector('#direccion').value = resultado.direccion;\n  document.querySelector('#ciudad').value = resultado.ciudad;\n  document.querySelector('#estado').value = resultado.estado;\n  document.querySelector('#pais').value = resultado.pais;\n  document.querySelector('#lat').value = resultado.lat;\n  document.querySelector('#lng').value = resultado.lng;\n}\n\n//# sourceURL=webpack://MeetiUp/./public/js/app.js?");

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