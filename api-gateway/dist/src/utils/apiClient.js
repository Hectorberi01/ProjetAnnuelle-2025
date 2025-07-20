"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class APIClient {
    constructor() {
        this.client = axios_1.default.create({
            timeout: 5000, // 5 secondes timeout
        });
        // Intercepteur pour ajouter automatiquement des headers
        this.client.interceptors.request.use((request) => {
            // Par exemple, ajouter un token si besoin :
            const token = ''; // récupère ici ton token depuis un service ou storage
            if (token) {
                request.headers.Authorization = `Bearer ${token}`;
            }
            return request;
        });
        // Intercepteur de réponse pour logging
        this.client.interceptors.response.use((response) => {
            var _a;
            console.log(`[APIClient] Success [${(_a = response.config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()}] ${response.config.url}`);
            return response;
        }, (error) => {
            var _a, _b, _c;
            console.error(`[APIClient] Error [${(_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase()}] ${(_c = error.config) === null || _c === void 0 ? void 0 : _c.url}`, error.message);
            return Promise.reject(error);
        });
    }
    // Méthode GET typée
    get(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(url, options);
            return response;
        });
    }
    // Méthode POST typée
    post(url, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post(url, data, options);
            return response;
        });
    }
    // Méthode PUT typée
    put(url, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.put(url, data, options);
            return response;
        });
    }
    // Méthode DELETE typée
    delete(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.delete(url, options);
            return response;
        });
    }
}
exports.apiClient = new APIClient();
