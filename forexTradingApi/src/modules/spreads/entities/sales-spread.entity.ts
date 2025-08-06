// forexTradingApi/src/modules/spreads/entities/sales-spread.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../currencies/entities/currency.entity';
import { QuoteOrigin } from '../../catalogs/entities/quote-origin.entity';
import { Segment } from '../../catalogs/entities/segment.entity';
import { FxProduct } from '../../catalogs/entities/fx-product.entity';

@Entity('sales_spread')
export class SalesSpread {
  @ApiProperty({
    description: 'Unique identifier for the sales spread',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Base currency ID',
    example: 1,
  })
  @Column({ name: 'base_currency_id', type: 'integer' })
  baseCurrencyId: number;

  @ApiProperty({
    description: 'Quote currency ID',
    example: 2,
  })
  @Column({ name: 'quote_currency_id', type: 'integer' })
  quoteCurrencyId: number;

  @ApiProperty({
    description: 'Quote origin ID',
    example: 1,
  })
  @Column({ name: 'origin_id', type: 'integer' })
  originId: number;

  @ApiProperty({
    description: 'Segment ID',
    example: 1,
  })
  @Column({ name: 'segment_id', type: 'integer' })
  segmentId: number;

  @ApiProperty({
    description: 'FX Product ID',
    example: 1,
  })
  @Column({ name: 'fx_product_id', type: 'integer' })
  fxProductId: number;

  @ApiProperty({
    description: 'Whether this applies to market hours',
    example: true,
  })
  @Column({ name: 'market_hours', type: 'boolean' })
  marketHours: boolean;

  @ApiProperty({
    description: 'Spread for buy operations',
    example: 0.0020,
  })
  @Column({ name: 'spread_buy', type: 'numeric', precision: 8, scale: 4 })
  spreadBuy: number;

  @ApiProperty({
    description: 'Spread for sell operations',
    example: 0.0025,
  })
  @Column({ name: 'spread_sell', type: 'numeric', precision: 8, scale: 4 })
  spreadSell: number;

  @ApiProperty({
    description: 'Date when spread was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ApiProperty({
    description: 'Base currency information',
    type: () => Currency,
  })
  @ManyToOne(() => Currency, { nullable: false, eager: false })
  @JoinColumn({ name: 'base_currency_id' })
  baseCurrency: Currency;

  @ApiProperty({
    description: 'Quote currency information',
    type: () => Currency,
  })
  @ManyToOne(() => Currency, { nullable: false, eager: false })
  @JoinColumn({ name: 'quote_currency_id' })
  quoteCurrency: Currency;

  @ApiProperty({
    description: 'Quote origin information',
    type: () => QuoteOrigin,
  })
  @ManyToOne(() => QuoteOrigin, { nullable: false, eager: false })
  @JoinColumn({ name: 'origin_id' })
  origin: QuoteOrigin;

  @ApiProperty({
    description: 'Segment information',
    type: () => Segment,
  })
  @ManyToOne(() => Segment, { nullable: false, eager: false })
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @ApiProperty({
    description: 'FX Product information',
    type: () => FxProduct,
  })
  @ManyToOne(() => FxProduct, { nullable: false, eager: false })
  @JoinColumn({ name: 'fx_product_id' })
  fxProduct: FxProduct;
}