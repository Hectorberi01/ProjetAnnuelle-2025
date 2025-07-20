"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CritereNotation = void 0;
const typeorm_1 = require("typeorm");
const GrilleNotation_1 = require("./GrilleNotation");
let CritereNotation = class CritereNotation {
};
exports.CritereNotation = CritereNotation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CritereNotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grille_id', type: 'uuid' }),
    __metadata("design:type", String)
], CritereNotation.prototype, "grilleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], CritereNotation.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CritereNotation.prototype, "poids", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CritereNotation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type_evaluation', length: 20, default: 'groupe' }),
    __metadata("design:type", String)
], CritereNotation.prototype, "typeEvaluation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GrilleNotation_1.GrilleNotation, grille => grille.criteres, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'grille_id' }),
    __metadata("design:type", GrilleNotation_1.GrilleNotation)
], CritereNotation.prototype, "grille", void 0);
exports.CritereNotation = CritereNotation = __decorate([
    (0, typeorm_1.Entity)('criteres_notation')
], CritereNotation);
