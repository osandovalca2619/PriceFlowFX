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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserDto {
    username;
    fullName;
    profileId;
    salesGroupId;
    status;
    password;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique username',
        example: 'johndoe_updated',
        minLength: 3,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Username must be a string' }),
    (0, class_validator_1.MinLength)(3, { message: 'Username must be at least 3 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Username must not exceed 50 characters' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User full name',
        example: 'John Doe Updated',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Full name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Full name must not exceed 100 characters' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User profile ID',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Profile ID must be an integer' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "profileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales group ID',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Sales group ID must be an integer' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "salesGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User status',
        example: 'inactivo',
        enum: ['activo', 'inactivo'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['activo', 'inactivo'], { message: 'Status must be either "activo" or "inactivo"' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User password',
        example: 'NewSecurePassword123!',
        minLength: 8,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Password must not exceed 255 characters' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
//# sourceMappingURL=update-user.dto.js.map