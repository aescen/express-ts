"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const common_permission_flag_enum_1=__importDefault(require("./common.permission.flag.enum"));class PermissionsMiddleware{permissionFlagRequired(e){return(s,i,o)=>i.locals.jwt.permissionFlag&e?o():i.status(403).send()}async onlySameUserOrAdminCanDoThisAction(e,s,i){const o=e.body&&e.body.id&&e.body.id===s.locals.jwt.id;return s.locals.jwt.permissionFlag&common_permission_flag_enum_1.default.ADMIN_PERMISSION||o?i():s.status(403).send()}}exports.default=new PermissionsMiddleware;