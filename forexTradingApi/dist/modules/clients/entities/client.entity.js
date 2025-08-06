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
exports.Client = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const segment_entity_1 = require("../../catalogs/entities/segment.entity");
let Client = class Client {
    id;
    clientIdentifier;
    name;
    segmentId;
    status;
    createdBy;
    createdAt;
    modifiedBy;
    modifiedAt;
    segment;
    creator;
    modifier;
};
exports.Client = Client;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the client',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client internal identifier',
        example: 'CLI001234',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ name: 'client_identifier', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Client.prototype, "clientIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client full name',
        example: 'Juan Pérez González',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client segment ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'segment_id', type: 'integer' }),
    __metadata("design:type", Number)
], Client.prototype, "segmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client status',
        example: 'activo',
        enum: ['activo', 'inactivo'],
        default: 'activo',
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'activo' }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of user who created this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer' }),
    __metadata("design:type", Number)
], Client.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when client was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who last modified this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'modified_by', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], Client.prototype, "modifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when client was last modified',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'modified_at' }),
    __metadata("design:type", Object)
], Client.prototype, "modifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client segment information',
        type: () => segment_entity_1.Segment,
    }),
    (0, typeorm_1.ManyToOne)(() => segment_entity_1.Segment, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'segment_id' }),
    __metadata("design:type", segment_entity_1.Segment)
], Client.prototype, "segment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who created this record',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Client.prototype, "creator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who last modified this record',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by' }),
    __metadata("design:type", user_entity_1.User)
], Client.prototype, "modifier", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)('client')
], Client);
//# sourceMappingURL=client.entity.js.map