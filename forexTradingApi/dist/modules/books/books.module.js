"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const operation_folders_service_1 = require("./operation-folders.service");
const operation_folders_controller_1 = require("./operation-folders.controller");
const operation_folder_entity_1 = require("./entities/operation-folder.entity");
let BooksModule = class BooksModule {
};
exports.BooksModule = BooksModule;
exports.BooksModule = BooksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([operation_folder_entity_1.OperationFolder]),
        ],
        controllers: [operation_folders_controller_1.OperationFoldersController],
        providers: [operation_folders_service_1.OperationFoldersService],
        exports: [operation_folders_service_1.OperationFoldersService, typeorm_1.TypeOrmModule],
    })
], BooksModule);
//# sourceMappingURL=books.module.js.map