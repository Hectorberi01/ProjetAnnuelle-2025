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
exports.NoteGroupe = void 0;
const typeorm_1 = require("typeorm");
let NoteGroupe = class NoteGroupe {
};
exports.NoteGroupe = NoteGroupe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NoteGroupe.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id', type: 'uuid' }),
    __metadata("design:type", String)
], NoteGroupe.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', type: 'uuid' }),
    __metadata("design:type", String)
], NoteGroupe.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grille_id', type: 'uuid' }),
    __metadata("design:type", String)
], NoteGroupe.prototype, "grilleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'critere_id' }),
    __metadata("design:type", Number)
], NoteGroupe.prototype, "critereId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], NoteGroupe.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], NoteGroupe.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NoteGroupe.prototype, "commentaire", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NoteGroupe.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], NoteGroupe.prototype, "updatedAt", void 0);
exports.NoteGroupe = NoteGroupe = __decorate([
    (0, typeorm_1.Entity)('notes_groupes')
], NoteGroupe);
