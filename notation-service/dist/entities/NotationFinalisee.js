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
exports.NotationFinalisee = void 0;
const typeorm_1 = require("typeorm");
let NotationFinalisee = class NotationFinalisee {
};
exports.NotationFinalisee = NotationFinalisee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotationFinalisee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id', type: 'uuid' }),
    __metadata("design:type", String)
], NotationFinalisee.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'group_id', type: 'uuid' }),
    __metadata("design:type", String)
], NotationFinalisee.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commentaire_projet', type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotationFinalisee.prototype, "commentaireProjet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note_finale', type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], NotationFinalisee.prototype, "noteFinale", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'finalisee_at' }),
    __metadata("design:type", Date)
], NotationFinalisee.prototype, "finaliseeAt", void 0);
exports.NotationFinalisee = NotationFinalisee = __decorate([
    (0, typeorm_1.Entity)('notations_finalisees')
], NotationFinalisee);
