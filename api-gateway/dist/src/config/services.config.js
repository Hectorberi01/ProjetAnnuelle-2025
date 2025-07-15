"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config();
const isDocker = process.env.DOCKER === 'true';
if (!isDocker) {
    console.log('Loading local environment variables');
    dotenv.config({ path: path_1.default.resolve(__dirname, '../../.local.env') });
}
else {
    console.log('port', process.env.PORT);
    dotenv.config();
}
exports.SERVICES = {
    projects: isDocker
        ? 'http://projets:3002/projects'
        : process.env.PROJETS || 'http://localhost:3002/projects',
    // grades: isDocker
    //   ? 'http://grades:3005/grades'
    //   : process.env.GRADES || 'http://localhost:3005/grades',
    groups: isDocker
        ? 'http://groupes:3004/groups'
        : process.env.GROUPES || 'http://localhost:3004/groups',
    users: isDocker
        ? 'http://users:3003/users'
        : process.env.USERS || 'http://localhost:3003/users',
    roles: isDocker
        ? 'http://users:3003/roles'
        : process.env.ROLES || 'http://localhost:3003/roles',
    promotions: isDocker
        ? 'http://promotions:3007/promotions'
        : process.env.PROMOTIONS || 'http://localhost:3007/promotions',
    auth: isDocker
        ? 'http://auth:3001/auth'
        : process.env.AUTH || 'http://localhost:3001/auth',
    deliverables: isDocker
        ? 'http://deliverables:3009/deliverables'
        : process.env.DELIVERABLES || 'http://localhost:3009/deliverables',
    reports: isDocker
        ? 'http://reports:3006/reports'
        : process.env.REPORTS || 'http://localhost:3006/reports',
    soutenances: isDocker
        ? 'http://soutenances:3010/soutenances'
        : process.env.SOUTENANCES || 'http://localhost:3010/soutenances',
};
