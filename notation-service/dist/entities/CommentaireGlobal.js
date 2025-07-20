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
exports.CommentaireGlobal = void 0;
const typeorm_1 = require("typeorm");
let CommentaireGlobal = class CommentaireGlobal {
};
exports.CommentaireGlobal = CommentaireGlobal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommentaireGlobal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id', type: 'uuid' }),
    __metadata("design:type", String)
], CommentaireGlobal.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', type: 'uuid' }),
    __metadata("design:type", String)
], CommentaireGlobal.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grille_id', type: 'uuid' }),
    __metadata("design:type", String)
], CommentaireGlobal.prototype, "grilleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CommentaireGlobal.prototype, "commentaire", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CommentaireGlobal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CommentaireGlobal.prototype, "updatedAt", void 0);
exports.CommentaireGlobal = CommentaireGlobal = __decorate([
    (0, typeorm_1.Entity)('commentaires_globaux')
], CommentaireGlobal);
