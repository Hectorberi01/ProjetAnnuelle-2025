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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPDFToR2 = uploadPDFToR2;
exports.downloadFromS3 = downloadFromS3;
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
function downloadFromS3(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const parsedUrl = new URL(url);
        console.log("Parsed URL:", parsedUrl);
        const bucketName = parsedUrl.hostname.split('.')[0];
        console.log("Bucket Name:", bucketName);
        const key = decodeURIComponent(parsedUrl.pathname.slice(1));
        console.log("Key:", key);
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        try {
            const response = yield s3.send(command);
            const stream = response.Body;
            console.log("Response Body Type:", typeof stream);
            const chunks = [];
            try {
                for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                    _c = stream_1_1.value;
                    _d = false;
                    const chunk = _c;
                    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Buffer.concat(chunks);
        }
        catch (error) {
            console.error("Erreur lors du téléchargement depuis S3:", error);
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
