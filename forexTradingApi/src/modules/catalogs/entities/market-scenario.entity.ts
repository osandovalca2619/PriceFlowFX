// forexTradingApi/src/modules/catalogs/entities/market-scenario.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('market_scenario')
export class MarketScenario {
  @ApiProperty({
    description: 'Unique identifier for the market scenario',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Scenario code',
    example: 'NORMAL',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @ApiProperty({
    description: 'Scenario name',
    example: 'Normal Market',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    description: 'Scenario description',
    example: 'Condiciones normales de mercado',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @ApiProperty({
    description: 'Volatility multiplier for this scenario',
    example: 1.0,
  })
  @Column({ name: 'volatility_multiplier', type: 'numeric', precision: 4, scale: 2, default: 1.0 })
  volatilityMultiplier: number;

  @ApiProperty({
    description: 'Whether this scenario is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  active: boolean;
}