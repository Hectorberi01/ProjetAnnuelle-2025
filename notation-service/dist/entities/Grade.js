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
exports.Grade = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DeliverableGrade {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DeliverableGrade.prototype, "deliverableId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeliverableGrade.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeliverableGrade.prototype, "weight", void 0);
class ReportGrade {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportGrade.prototype, "reportId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReportGrade.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReportGrade.prototype, "weight", void 0);
class PresentationGrade {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PresentationGrade.prototype, "presentationId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PresentationGrade.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PresentationGrade.prototype, "weight", void 0);
let Grade = class Grade {
};
exports.Grade = Grade;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Grade.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Grade.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Grade.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Grade.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DeliverableGrade),
    __metadata("design:type", Array)
], Grade.prototype, "deliverableGrades", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportGrade),
    __metadata("design:type", Array)
], Grade.prototype, "reportGrades", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PresentationGrade),
    __metadata("design:type", PresentationGrade)
], Grade.prototype, "presentationGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Grade.prototype, "finalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Grade.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Grade.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Grade.prototype, "updatedAt", void 0);
exports.Grade = Grade = __decorate([
    (0, typeorm_1.Entity)('grades')
], Grade);
