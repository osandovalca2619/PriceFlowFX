// forexTradingApi/src/modules/spreads/entities/trading-spread-range.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../currencies/entities/currency.entity';
import { MarketScenario } from '../../catalogs/entities/market-scenario.entity';

@Entity('trading_spread_range')
export class TradingSpreadRange {
  @ApiProperty({
    description: 'Unique identifier for the trading spread range',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Currency ID',
    example: 1,
  })
  @Column({ name: 'currency_id', type: 'integer' })
  currencyId: number;

  @ApiProperty({
    description: 'Market scenario ID',
    example: 1,
  })
  @Column({ name: 'scenario_id', type: 'integer' })
  scenarioId: number;

  @ApiProperty({
    description: 'Minimum amount for this range',
    example: 0.00,
  })
  @Column({ name: 'amount_min', type: 'numeric', precision: 18, scale: 2 })
  amountMin: number;

  @ApiProperty({
    description: 'Maximum amount for this range',
    example: 500000.00,
  })
  @Column({ name: 'amount_max', type: 'numeric', precision: 18, scale: 2 })
  amountMax: number;

  @ApiProperty({
    description: 'Spread applied in this range',
    example: 0.0020,
  })
  @Column({ type: 'numeric', precision: 8, scale: 4 })
  spread: number;

  @ApiProperty({
    description: 'Date when range was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ApiProperty({
    description: 'Currency information',
    type: () => Currency,
  })
  @ManyToOne(() => Currency, { nullable: false, eager: false })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ApiProperty({
    description: 'Market scenario information',
    type: () => MarketScenario,
  })
  @ManyToOne(() => MarketScenario, { nullable: false, eager: false })
  @JoinColumn({ name: 'scenario_id' })
  scenario: MarketScenario;
}