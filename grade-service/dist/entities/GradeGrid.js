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
exports.GradeGrid = void 0;
const typeorm_1 = require("typeorm");
const GradeCriterion_1 = require("./GradeCriterion");
let GradeGrid = class GradeGrid {
};
exports.GradeGrid = GradeGrid;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GradeGrid.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GradeGrid.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GradeGrid.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GradeGrid.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GradeCriterion_1.GradeCriterion, criterion => criterion.grid, { cascade: true }),
    __metadata("design:type", Array)
], GradeGrid.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], GradeGrid.prototype, "isFinalized", void 0);
exports.GradeGrid = GradeGrid = __decorate([
    (0, typeorm_1.Entity)()
], GradeGrid);
