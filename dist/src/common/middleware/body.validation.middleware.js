"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const express_validator_1=require("express-validator");class BodyValidationMiddleware{verifyBodyFieldsErrors(e,r,s){const a=(0,express_validator_1.validationResult)(e);return a.isEmpty()?s():r.status(400).send({errors:a.array()})}}exports.default=new BodyValidationMiddleware;