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
exports.CreateOperationFolderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const operation_folder_entity_1 = require("../entities/operation-folder.entity");
class CreateOperationFolderDto {
    code;
    name;
    folderType;
    status = 'activo';
    createdBy;
}
exports.CreateOperationFolderDto = CreateOperationFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Folder code',
        example: 'MMSSPTX',
        maxLength: 30,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateOperationFolderDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Folder name',
        example: 'Mesa de Money Trading',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateOperationFolderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Folder type',
        example: operation_folder_entity_1.FolderType.TRADING,
        enum: operation_folder_entity_1.FolderType,
    }),
    (0, class_validator_1.IsEnum)(operation_folder_entity_1.FolderType),
    __metadata("design:type", String)
], CreateOperationFolderDto.prototype, "folderType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Folder status',
        example: 'activo',
        enum: ['activo', 'inactivo'],
        default: 'activo',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOperationFolderDto.prototype, "status", void 0);
//# sourceMappingURL=create-operation-folder.dto.js.map