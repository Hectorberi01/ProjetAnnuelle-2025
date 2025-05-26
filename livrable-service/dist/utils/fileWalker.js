"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkFiles = walkFiles;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function walkFiles(dir, extensions) {
    const files = [];
    const items = fs_1.default.readdirSync(dir);
    for (const item of items) {
        const fullPath = path_1.default.join(dir, item);
        if (fs_1.default.statSync(fullPath).isDirectory()) {
            files.push(...walkFiles(fullPath, extensions));
        }
        else if (extensions.includes(path_1.default.extname(fullPath).toLowerCase())) {
            files.push(fullPath);
        }
    }
    return files;
}
