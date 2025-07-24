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
exports.extractZip = extractZip;
const unzipper_1 = __importDefault(require("unzipper"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const util_1 = require("util");
const stream_1 = __importDefault(require("stream"));
const cloudfareService_1 = require("../services/cloudfareService");
const pipeline = (0, util_1.promisify)(stream_1.default.pipeline);
dotenv_1.default.config();
function extractZip(fileUrl, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        //télécharger le fichier depuis AWS S3
        const { fileName, fileStream } = yield (0, cloudfareService_1.downloadFromS3ForCheck)(fileUrl);
        console.log(`Fichier téléchargé: ${fileName}`);
        console.log(`Flux de fichier: ${fileStream}`);
        if (!fileName || !fileStream) {
            throw new Error('Impossible de télécharger le fichier depuis S3');
        }
        const isZip = fileName.toLowerCase().endsWith('.zip');
        const filePath = path_1.default.join(dest, fileName);
        yield fs_1.default.promises.mkdir(dest, { recursive: true });
        if (isZip) {
            // Extraction directe depuis le stream
            yield pipeline(fileStream, unzipper_1.default.Extract({ path: dest }));
            console.log(`Fichier ZIP extrait dans ${dest}`);
        }
        else {
            // Sauvegarde brute
            const writeStream = fs_1.default.createWriteStream(filePath);
            yield pipeline(fileStream, writeStream);
            console.log(`Fichier enregistré dans ${filePath}`);
        }
    });
}
