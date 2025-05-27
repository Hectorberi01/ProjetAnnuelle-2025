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
exports.convertAllToText = convertAllToText;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const xlsx_1 = __importDefault(require("xlsx"));
const fileWalker_1 = require("./fileWalker");
function convertAllToText(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const supportedExts = ['.txt', '.pdf', '.docx', '.xlsx', '.js', '.ts', '.java', '.py', '.cpp'];
        const files = (0, fileWalker_1.walkFiles)(folder, supportedExts);
        let fullText = '';
        for (const file of files) {
            const ext = path_1.default.extname(file).toLowerCase();
            try {
                if (ext === '.pdf') {
                    const buffer = yield promises_1.default.readFile(file);
                    const data = yield (0, pdf_parse_1.default)(buffer);
                    fullText += data.text;
                }
                else if (ext === '.docx') {
                    const buffer = yield promises_1.default.readFile(file);
                    const result = yield mammoth_1.default.extractRawText({ buffer });
                    fullText += result.value;
                }
                else if (ext === '.xlsx') {
                    const workbook = xlsx_1.default.readFile(file);
                    workbook.SheetNames.forEach(sheet => {
                        const data = xlsx_1.default.utils.sheet_to_csv(workbook.Sheets[sheet]);
                        fullText += data;
                    });
                }
                else {
                    const data = yield promises_1.default.readFile(file, 'utf-8');
                    fullText += data;
                }
            }
            catch (e) {
                console.warn(`⚠️ Impossible de lire ${file}`);
            }
        }
        return fullText;
    });
}
