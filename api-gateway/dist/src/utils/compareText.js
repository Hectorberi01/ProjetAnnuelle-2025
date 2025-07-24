"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTextSimilarity = compareTextSimilarity;
const string_similarity_1 = __importDefault(require("string-similarity"));
function compareTextSimilarity(a, b) {
    return string_similarity_1.default.compareTwoStrings(a, b); // retourne un score entre 0 et 1
}
