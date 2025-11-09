"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/ads/create/route";
exports.ids = ["app/api/admin/ads/create/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&page=%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute.ts&appDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&page=%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute.ts&appDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Applications_XAMPP_xamppfiles_htdocs_sparkio_sparkio_app_api_admin_ads_create_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/ads/create/route.ts */ \"(rsc)/./app/api/admin/ads/create/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/ads/create/route\",\n        pathname: \"/api/admin/ads/create\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/ads/create/route\"\n    },\n    resolvedPagePath: \"/Applications/XAMPP/xamppfiles/htdocs/sparkio/sparkio/app/api/admin/ads/create/route.ts\",\n    nextConfigOutput,\n    userland: _Applications_XAMPP_xamppfiles_htdocs_sparkio_sparkio_app_api_admin_ads_create_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/ads/create/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmFkcyUyRmNyZWF0ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYWRtaW4lMkZhZHMlMkZjcmVhdGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhZG1pbiUyRmFkcyUyRmNyZWF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZBcHBsaWNhdGlvbnMlMkZYQU1QUCUyRnhhbXBwZmlsZXMlMkZodGRvY3MlMkZzcGFya2lvJTJGc3BhcmtpbyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGQXBwbGljYXRpb25zJTJGWEFNUFAlMkZ4YW1wcGZpbGVzJTJGaHRkb2NzJTJGc3BhcmtpbyUyRnNwYXJraW8maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3VDO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3Bhcmtpby8/ODQ2YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvQXBwbGljYXRpb25zL1hBTVBQL3hhbXBwZmlsZXMvaHRkb2NzL3NwYXJraW8vc3Bhcmtpby9hcHAvYXBpL2FkbWluL2Fkcy9jcmVhdGUvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FkbWluL2Fkcy9jcmVhdGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi9hZHMvY3JlYXRlXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hZG1pbi9hZHMvY3JlYXRlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL0FwcGxpY2F0aW9ucy9YQU1QUC94YW1wcGZpbGVzL2h0ZG9jcy9zcGFya2lvL3NwYXJraW8vYXBwL2FwaS9hZG1pbi9hZHMvY3JlYXRlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hZG1pbi9hZHMvY3JlYXRlL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&page=%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute.ts&appDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/admin/ads/create/route.ts":
/*!*******************************************!*\
  !*** ./app/api/admin/ads/create/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/env */ \"(rsc)/./src/lib/env.ts\");\n\n\n\nasync function POST(request) {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)().get(\"sparkio_token\")?.value;\n    if (!token) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            success: false,\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    const payload = await request.json().catch(()=>null);\n    const response = await fetch(`${_lib_env__WEBPACK_IMPORTED_MODULE_2__.env.API_BASE_URL}/api/admin/ads/create.php`, {\n        method: \"POST\",\n        headers: {\n            \"Content-Type\": \"application/json\",\n            Authorization: `Bearer ${token}`\n        },\n        body: JSON.stringify(payload)\n    });\n    const result = await response.json().catch(()=>null);\n    if (!response.ok) {\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            success: false,\n            error: result?.error ?? \"Unable to create ad.\"\n        }, {\n            status: response.status || 500\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json(result);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2Fkcy9jcmVhdGUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF1QztBQUNpQjtBQUV4QjtBQUV6QixlQUFlRyxLQUFLQyxPQUFvQjtJQUM3QyxNQUFNQyxRQUFRTCxxREFBT0EsR0FBR00sR0FBRyxDQUFDLGtCQUFrQkM7SUFDOUMsSUFBSSxDQUFDRixPQUFPO1FBQ1YsT0FBT0oscURBQVlBLENBQUNPLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU9DLE9BQU87UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNwRjtJQUVBLE1BQU1DLFVBQVUsTUFBTVIsUUFBUUksSUFBSSxHQUFHSyxLQUFLLENBQUMsSUFBTTtJQUVqRCxNQUFNQyxXQUFXLE1BQU1DLE1BQU0sQ0FBQyxFQUFFYix5Q0FBR0EsQ0FBQ2MsWUFBWSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7UUFDM0VDLFFBQVE7UUFDUkMsU0FBUztZQUNQLGdCQUFnQjtZQUNoQkMsZUFBZSxDQUFDLE9BQU8sRUFBRWQsTUFBTSxDQUFDO1FBQ2xDO1FBQ0FlLE1BQU1DLEtBQUtDLFNBQVMsQ0FBQ1Y7SUFDdkI7SUFFQSxNQUFNVyxTQUFTLE1BQU1ULFNBQVNOLElBQUksR0FBR0ssS0FBSyxDQUFDLElBQU07SUFFakQsSUFBSSxDQUFDQyxTQUFTVSxFQUFFLEVBQUU7UUFDaEIsT0FBT3ZCLHFEQUFZQSxDQUFDTyxJQUFJLENBQ3RCO1lBQUVDLFNBQVM7WUFBT0MsT0FBT2EsUUFBUWIsU0FBUztRQUF1QixHQUNqRTtZQUFFQyxRQUFRRyxTQUFTSCxNQUFNLElBQUk7UUFBSTtJQUVyQztJQUVBLE9BQU9WLHFEQUFZQSxDQUFDTyxJQUFJLENBQUNlO0FBQzNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3Bhcmtpby8uL2FwcC9hcGkvYWRtaW4vYWRzL2NyZWF0ZS9yb3V0ZS50cz81ZGMzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmltcG9ydCB7IGVudiB9IGZyb20gXCJAL2xpYi9lbnZcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgdG9rZW4gPSBjb29raWVzKCkuZ2V0KFwic3Bhcmtpb190b2tlblwiKT8udmFsdWU7XG4gIGlmICghdG9rZW4pIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKS5jYXRjaCgoKSA9PiBudWxsKTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2Vudi5BUElfQkFTRV9VUkx9L2FwaS9hZG1pbi9hZHMvY3JlYXRlLnBocGAsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogcmVzdWx0Py5lcnJvciA/PyBcIlVuYWJsZSB0byBjcmVhdGUgYWQuXCIgfSxcbiAgICAgIHsgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMgfHwgNTAwIH0sXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihyZXN1bHQpO1xufVxuXG4iXSwibmFtZXMiOlsiY29va2llcyIsIk5leHRSZXNwb25zZSIsImVudiIsIlBPU1QiLCJyZXF1ZXN0IiwidG9rZW4iLCJnZXQiLCJ2YWx1ZSIsImpzb24iLCJzdWNjZXNzIiwiZXJyb3IiLCJzdGF0dXMiLCJwYXlsb2FkIiwiY2F0Y2giLCJyZXNwb25zZSIsImZldGNoIiwiQVBJX0JBU0VfVVJMIiwibWV0aG9kIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc3VsdCIsIm9rIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/ads/create/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/env.ts":
/*!************************!*\
  !*** ./src/lib/env.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   env: () => (/* binding */ env)\n/* harmony export */ });\nconst clientEnv = {\n    NEXT_PUBLIC_API_BASE_URL: \"http://localhost/sparkio/sparkio\" ?? 0\n};\nconst serverEnv = {\n    API_BASE_URL: process.env.API_BASE_URL ?? clientEnv.NEXT_PUBLIC_API_BASE_URL\n};\nconst env = {\n    ...clientEnv,\n    ...serverEnv\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2Vudi50cyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTUEsWUFBWTtJQUNoQkMsMEJBQTBCQyxrQ0FBb0MsSUFBSSxDQUF1QjtBQUMzRjtBQUVBLE1BQU1FLFlBQVk7SUFDaEJDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0UsWUFBWSxJQUFJTCxVQUFVQyx3QkFBd0I7QUFDOUU7QUFFTyxNQUFNRSxNQUFNO0lBQ2pCLEdBQUdILFNBQVM7SUFDWixHQUFHSSxTQUFTO0FBQ2QsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL3NwYXJraW8vLi9zcmMvbGliL2Vudi50cz84NDg1Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNsaWVudEVudiA9IHtcbiAgTkVYVF9QVUJMSUNfQVBJX0JBU0VfVVJMOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUElfQkFTRV9VUkwgPz8gXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIixcbn07XG5cbmNvbnN0IHNlcnZlckVudiA9IHtcbiAgQVBJX0JBU0VfVVJMOiBwcm9jZXNzLmVudi5BUElfQkFTRV9VUkwgPz8gY2xpZW50RW52Lk5FWFRfUFVCTElDX0FQSV9CQVNFX1VSTCxcbn07XG5cbmV4cG9ydCBjb25zdCBlbnYgPSB7XG4gIC4uLmNsaWVudEVudixcbiAgLi4uc2VydmVyRW52LFxufTtcblxuIl0sIm5hbWVzIjpbImNsaWVudEVudiIsIk5FWFRfUFVCTElDX0FQSV9CQVNFX1VSTCIsInByb2Nlc3MiLCJlbnYiLCJzZXJ2ZXJFbnYiLCJBUElfQkFTRV9VUkwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/env.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&page=%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fads%2Fcreate%2Froute.ts&appDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FApplications%2FXAMPP%2Fxamppfiles%2Fhtdocs%2Fsparkio%2Fsparkio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();