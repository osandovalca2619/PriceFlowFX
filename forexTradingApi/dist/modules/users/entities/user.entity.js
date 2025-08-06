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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_profile_entity_1 = require("./user-profile.entity");
let User = class User {
    id;
    username;
    fullName;
    profileId;
    salesGroupId;
    status;
    createdBy;
    createdAt;
    modifiedBy;
    modifiedAt;
    password;
    profile;
    creator;
    modifier;
    transactions;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the user',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique username',
        example: 'johndoe',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'John Doe',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User profile ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'profile_id', type: 'integer' }),
    __metadata("design:type", Number)
], User.prototype, "profileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales group ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'sales_group_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "salesGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User status',
        example: 'activo',
        enum: ['activo', 'inactivo'],
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'activo' }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of user who created this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer' }),
    __metadata("design:type", Number)
], User.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when user was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who last modified this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'modified_by', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "modifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when user was last modified',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'modified_at' }),
    __metadata("design:type", Object)
], User.prototype, "modifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User password (hashed)',
        example: '$2b$10$...',
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, select: false, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User profile information',
        type: () => user_profile_entity_1.UserProfile,
    }),
    (0, typeorm_1.ManyToOne)(() => user_profile_entity_1.UserProfile, profile => profile.users, {
        eager: false,
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'profile_id' }),
    __metadata("design:type", user_profile_entity_1.UserProfile)
], User.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who created this record',
        type: () => User,
    }),
    (0, typeorm_1.ManyToOne)(() => User, {
        nullable: true,
        eager: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User)
], User.prototype, "creator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who last modified this record',
        type: () => User,
    }),
    (0, typeorm_1.ManyToOne)(() => User, {
        nullable: true,
        eager: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by' }),
    __metadata("design:type", User)
], User.prototype, "modifier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.user),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('app_user')
], User);
const transaction_entity_1 = require("../../transactions/entities/transaction.entity");
//# sourceMappingURL=user.entity.js.map