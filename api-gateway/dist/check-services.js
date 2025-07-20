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
const axios_1 = __importDefault(require("axios"));
const services_config_1 = require("./src/config/services.config");
const checkService = (name, url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get(url, { timeout: 3000 });
        console.log(`✅ [${name}] Réponse ${res.status} OK -> ${url}`);
    }
    catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error(`❌ [${name}] Connexion refusée -> ${url}`);
        }
        else if (err.code === 'ETIMEDOUT') {
            console.error(`❌ [${name}] Timeout -> ${url}`);
        }
        else {
            console.error(`⚠️  [${name}] Erreur (${err.code || err.message}) -> ${url}`);
        }
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🔍 Vérification de la connectivité des microservices:\n');
    for (const [name, url] of Object.entries(services_config_1.SERVICES)) {
        yield checkService(name, url);
    }
    console.log('\n✅ Vérification terminée.\n');
});
main();
