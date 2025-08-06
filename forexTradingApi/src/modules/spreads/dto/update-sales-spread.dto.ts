// forexTradingApi/src/modules/spreads/dto/update-sales-spread.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateSalesSpreadDto } from './create-sales-spread.dto';

export class UpdateSalesSpreadDto extends PartialType(CreateSalesSpreadDto) {}