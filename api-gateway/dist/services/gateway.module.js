"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const gateway_project_service_1 = require("./projets/gateway.project.service");
const project_controller_1 = require("../controllers/project.controller");
const promotion_controller_1 = require("../controllers/promotion.controller");
const gateway_promotion_service_1 = require("./promotion/gateway.promotion.service");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [project_controller_1.ProjectController, promotion_controller_1.PromotionController],
        providers: [gateway_project_service_1.GatewayProjectService, gateway_promotion_service_1.GatewayPromotionService]
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map