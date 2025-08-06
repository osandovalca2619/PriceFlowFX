// forexTradingApi/src/modules/spreads/dto/update-trading-spread.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTradingSpreadDto } from './create-trading-spread.dto';

export class UpdateTradingSpreadDto extends PartialType(CreateTradingSpreadDto) {}