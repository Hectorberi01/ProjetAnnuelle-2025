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
exports.GradingCriteria = exports.CriteriaType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const GradingGrid_1 = require("./GradingGrid");
var CriteriaType;
(function (CriteriaType) {
    CriteriaType["GROUP"] = "group";
    CriteriaType["INDIVIDUAL"] = "individual";
})(CriteriaType || (exports.CriteriaType = CriteriaType = {}));
let GradingCriteria = class GradingCriteria {
};
exports.GradingCriteria = GradingCriteria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GradingCriteria.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GradingCriteria.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GradingCriteria.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CriteriaType }),
    (0, class_validator_1.IsEnum)(CriteriaType),
    __metadata("design:type", String)
], GradingCriteria.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GradingCriteria.prototype, "isCommentRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "deliverableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GradingCriteria.prototype, "presentationId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GradingGrid_1.GradingGrid, grid => grid.criteria),
    __metadata("design:type", Array)
], GradingCriteria.prototype, "gradingGrids", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GradingCriteria.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GradingCriteria.prototype, "updatedAt", void 0);
exports.GradingCriteria = GradingCriteria = __decorate([
    (0, typeorm_1.Entity)('grading_criteria')
], GradingCriteria);
