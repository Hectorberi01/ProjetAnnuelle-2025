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
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const util_1 = require("util");
const stream_1 = __importDefault(require("stream"));
const pipeline = (0, util_1.promisify)(stream_1.default.pipeline);
dotenv_1.default.config();
function extractZip(fileUrl, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
        const fileId = fileIdMatch === null || fileIdMatch === void 0 ? void 0 : fileIdMatch[1];
        if (!fileId) {
            throw new Error('Invalid file URL: Unable to extract file ID');
        }
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.join(process.env.GDRIVE_CREDENTIALS_PATH || 'google-drive-credentials.json'),
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const metadata = yield drive.files.get({
            fileId,
            fields: 'name, mimeType',
        });
        const fileName = metadata.data.name || `fichier_${fileId}`;
        const isZip = fileName.toLowerCase().endsWith('.zip');
        const filePath = path_1.default.join(dest, fileName);
        const res = yield drive.files.get({
            fileId,
            alt: 'media',
        }, { responseType: 'stream' });
        yield fs_1.default.promises.mkdir(dest, { recursive: true });
        if (isZip) {
            // extraire directement
            yield res.data.pipe(unzipper_1.default.Extract({ path: dest })).promise();
        }
        else {
            // enregistrer le fichier brut
            const writeStream = fs_1.default.createWriteStream(filePath);
            yield pipeline(res.data, writeStream);
        }
        //const res = await axios.get(fileUrl, { responseType: 'stream' });
        //await res.data.pipe(unzipper.Extract({ path: dest })).promise();
    });
}
