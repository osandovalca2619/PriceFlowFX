"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const catalogs_service_1 = require("./catalogs.service");
const catalogs_controller_1 = require("./catalogs.controller");
const segment_entity_1 = require("./entities/segment.entity");
const quote_origin_entity_1 = require("./entities/quote-origin.entity");
const fx_product_entity_1 = require("./entities/fx-product.entity");
const market_scenario_entity_1 = require("./entities/market-scenario.entity");
const fx_operation_status_entity_1 = require("../operations/entities/fx-operation-status.entity");
let CatalogsModule = class CatalogsModule {
};
exports.CatalogsModule = CatalogsModule;
exports.CatalogsModule = CatalogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                segment_entity_1.Segment,
                quote_origin_entity_1.QuoteOrigin,
                fx_product_entity_1.FxProduct,
                market_scenario_entity_1.MarketScenario,
                fx_operation_status_entity_1.FxOperationStatus,
            ]),
        ],
        controllers: [catalogs_controller_1.CatalogsController],
        providers: [catalogs_service_1.CatalogsService],
        exports: [catalogs_service_1.CatalogsService, typeorm_1.TypeOrmModule],
    })
], CatalogsModule);
//# sourceMappingURL=catalogs.module.js.map