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
const stream = __importStar(require("stream"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GoogleDriveService {
    constructor() {
        var _a;
        const auth = new googleapis_1.google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: (_a = process.env.GOOGLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderId = process.env.GDRIVE_FOLDER_ID;
            if (!folderId) {
                throw new Error('GDRIVE_FOLDER_ID is not defined in environment variables');
            }
            if (!file || !file.buffer || !file.originalname || !file.mimetype) {
                throw new Error('Invalid file object');
            }
            console.log('Uploading file to Google Drive:', file.originalname);
            console.log('File MIME type:', file.mimetype);
            console.log('File size:', file.size, 'bytes');
            console.log('Folder ID:', folderId);
            const mimeType = 'application/pdf';
            try {
                // Create a pass-through stream for the file buffer
                const bufferStream = new stream.PassThrough();
                bufferStream.end(file.buffer);
                // Upload the file to Google Drive
                const response = yield this.drive.files.create({
                    // Paramètres principaux
                    requestBody: {
                        name: file.originalname,
                        mimeType,
                        parents: [folderId],
                    },
                    media: {
                        mimeType,
                        body: bufferStream,
                    },
                    // Options supplémentaires (comme supportsAllDrives) doivent être au niveau racine
                    supportsAllDrives: true,
                    fields: 'id,name,webViewLink',
                }); // "as any" pour éviter les erreurs TypeScript si nécessaire
                console.log('File uploaded successfully:', response.data);
                const fileId = response.data.id;
                if (!fileId) {
                    throw new Error("File ID is missing after upload");
                }
                // Make the file publicly readable
                yield this.drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone',
                    },
                    supportsAllDrives: true, // Nécessaire pour les Shared Drives
                    fields: 'id'
                });
                console.log('Permissions set for file:', fileId);
                return `https://drive.google.com/file/d/${fileId}/view`;
            }
            catch (error) {
                console.error('Error uploading file to Google Drive:', error);
                throw new Error(`Failed to upload file: ${error}`);
            }
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
