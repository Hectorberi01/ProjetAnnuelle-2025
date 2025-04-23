"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const user_routes_1 = __importDefault(require("./user.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const initRoutes = (app) => {
    app.use("/users", user_routes_1.default);
    app.use("/roles", role_routes_1.default);
    console.log("Routes /users et /roles initialisées.");
};
exports.initRoutes = initRoutes;
