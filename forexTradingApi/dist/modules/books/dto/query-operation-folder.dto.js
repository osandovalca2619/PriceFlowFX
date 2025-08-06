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
exports.QueryOperationFolderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const operation_folder_entity_1 = require("../entities/operation-folder.entity");
class QueryOperationFolderDto {
    folderType;
    status;
    code;
    name;
}
exports.QueryOperationFolderDto = QueryOperationFolderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by folder type',
        example: operation_folder_entity_1.FolderType.TRADING,
        enum: operation_folder_entity_1.FolderType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(operation_folder_entity_1.FolderType),
    __metadata("design:type", String)
], QueryOperationFolderDto.prototype, "folderType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by folder status',
        example: 'activo',
        enum: ['activo', 'inactivo'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOperationFolderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by folder code (partial match)',
        example: 'MMSS',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOperationFolderDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by folder name (partial match)',
        example: 'Trading',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOperationFolderDto.prototype, "name", void 0);
//# sourceMappingURL=query-operation-folder.dto.js.map