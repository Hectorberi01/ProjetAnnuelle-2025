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
exports.uploadPDFToR2 = uploadPDFToR2;
exports.getSignedPdfUrl = getSignedPdfUrl;
exports.extractKeyFromS3Url = extractKeyFromS3Url;
exports.getPublicPDFUrl = getPublicPDFUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
function uploadPDFToR2(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = encodeURIComponent(file.originalname);
        console.log('Uploading file to R2:', key);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        console.log('Command to upload:', command);
        try {
            const result = yield s3.send(command);
            console.log('✅ File uploaded successfully to R2:', key);
            console.log('✅ Result:', result);
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            console.error('Error uploading file to R2:', error);
            throw error;
        }
    });
}
function getSignedPdfUrl(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
        return yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 }); // 1h
    });
}
function extractKeyFromS3Url(url) {
    const { pathname } = new URL(url);
    return decodeURIComponent(pathname.slice(1));
}
function getPublicPDFUrl(filename) {
    return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${encodeURIComponent(filename)}`;
}
