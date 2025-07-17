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
exports.GradingGrid = exports.GradingType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const GradingCriteria_1 = require("./GradingCriteria");
var GradingType;
(function (GradingType) {
    GradingType["DELIVERABLE"] = "deliverable";
    GradingType["REPORT"] = "report";
    GradingType["PRESENTATION"] = "presentation";
})(GradingType || (exports.GradingType = GradingType = {}));
class CriteriaScore {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriteriaScore.prototype, "criteriaId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CriteriaScore.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CriteriaScore.prototype, "comment", void 0);
let GradingGrid = class GradingGrid {
};
exports.GradingGrid = GradingGrid;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradingGrid.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: GradingType }),
    (0, class_validator_1.IsEnum)(GradingType),
    __metadata("design:type", String)
], GradingGrid.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CriteriaScore),
    __metadata("design:type", Array)
], GradingGrid.prototype, "criteriaScores", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "globalComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GradingGrid.prototype, "finalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GradingGrid.prototype, "isValidated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "gradedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], GradingGrid.prototype, "gradedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingGrid.prototype, "criteriaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GradingCriteria_1.GradingCriteria, criteria => criteria.gradingGrids),
    (0, typeorm_1.JoinColumn)({ name: 'criteriaId' }),
    __metadata("design:type", GradingCriteria_1.GradingCriteria)
], GradingGrid.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradingGrid.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradingGrid.prototype, "updatedAt", void 0);
exports.GradingGrid = GradingGrid = __decorate([
    (0, typeorm_1.Entity)('grading_grids')
], GradingGrid);
