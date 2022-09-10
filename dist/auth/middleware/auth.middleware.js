"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,i){void 0===i&&(i=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,i,s)}:function(e,t,r,i){void 0===i&&(i=r),e[i]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const argon2=__importStar(require("argon2")),users_service_1=__importDefault(require("../../users/services/users.service"));class AuthMiddleware{async verifyUserPassword(e,t,r){const i=await users_service_1.default.readByEmailWithPassword(e.body.email);if(!i)return t.status(404).send({errors:["User not found"]});const[s,a]=i.password.split(".$."),o=`${btoa(e.body.password)}${a}`;return await argon2.verify(s,o)?(e.body={id:i._id,email:i.email,permissionFlag:i.permissionFlag},r()):t.status(400).send({errors:["Invalid email and/or password"]})}}exports.default=new AuthMiddleware;