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
exports.GoogleDriveService = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GoogleDriveService {
    constructor() {
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: path_1.default.join(__dirname, '..', 'google-drive-credentials.json'),
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderId = process.env.GDRIVE_FOLDER_ID;
            if (!folderId) {
                throw new Error('GDRIVE_FOLDER_ID is not defined in environment variables');
            }
            const response = yield this.drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs_1.default.createReadStream(file.path),
                },
            });
            const fileId = response.data.id;
            return `https://drive.google.com/file/d/${fileId}/view`;
        });
    }
    downloadFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.drive.files.get({
                fileId,
                alt: 'media',
            }, { responseType: 'stream' });
            return response.data;
        });
    }
    getFileMetadata(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.drive.files.get({
                fileId,
                fields: 'name',
            });
            return res.data.name || 'downloaded-file';
        });
    }
}
exports.GoogleDriveService = GoogleDriveService;
