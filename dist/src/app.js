"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,u){void 0===u&&(u=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,u,s)}:function(e,t,r,u){void 0===u&&(u=r),e[u]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),require("./utils/env");const express_1=__importDefault(require("express")),http=__importStar(require("http")),cors_1=__importDefault(require("cors")),helmet_1=__importDefault(require("helmet")),express_rate_limit_1=__importDefault(require("express-rate-limit")),expressWinston=__importStar(require("express-winston")),debug_util_1=__importStar(require("./utils/debug.util")),users_routes_config_1=__importDefault(require("./users/users.routes.config")),auth_routes_config_1=__importDefault(require("./auth/auth.routes.config")),port=3e3,app=(0,express_1.default)(),server=http.createServer(app),routes=[],debugLog=(0,debug_util_1.default)("app"),limiter=(0,express_rate_limit_1.default)({windowMs:9e5,max:100,standardHeaders:!0,legacyHeaders:!1});process.env.DEBUG||(debug_util_1.loggerOptions.meta=!1,"function"==typeof global.it&&(debug_util_1.loggerOptions.level="http")),app.use(expressWinston.logger(debug_util_1.loggerOptions)),app.use(express_1.default.json()),app.use((0,cors_1.default)()),app.use((0,helmet_1.default)()),app.use(limiter),routes.push(new users_routes_config_1.default(app)),routes.push(new auth_routes_config_1.default(app));const runningMessage="Server is running at http://localhost:3000";app.get("/",((e,t)=>{t.status(200).send(runningMessage)})),app.use("*",((e,t)=>(t.status(404),t.send({errors:["Resource not found"]})))),server.listen(3e3,(()=>{routes.forEach((e=>{debugLog(`Routes configured for ${e.getName()}`)})),console.log(runningMessage)})),exports.default=server;