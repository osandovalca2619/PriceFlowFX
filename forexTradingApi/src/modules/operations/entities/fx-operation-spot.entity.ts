// forexTradingApi/src/modules/operations/entities/fx-operation-spot.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { OperationFolder } from '../../books/entities/operation-folder.entity';
import { FxOperationStatus } from './fx-operation-status.entity';
import { QuoteOrigin } from '../../catalogs/entities/quote-origin.entity';
import { Segment } from '../../catalogs/entities/segment.entity';

export enum OperationSide {
  BUY = 'buy',
  SELL = 'sell',
}

@Entity('fx_operation_spot')
export class FxOperationSpot {
  @ApiProperty({
    description: 'Unique identifier for the FX operation',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Client who performs the operation',
    example: 1,
  })
  @Column({ name: 'client_id', type: 'integer' })
  clientId: number;

  @ApiProperty({
    description: 'User who registers the operation',
    example: 1,
  })
  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @ApiProperty({
    description: 'Amount in currency 1',
    example: 100000.00,
  })
  @Column({ name: 'amount_currency1', type: 'numeric', precision: 18, scale: 2 })
  amountCurrency1: number;

  @ApiProperty({
    description: 'Amount in currency 2',
    example: 108500.00,
  })
  @Column({ name: 'amount_currency2', type: 'numeric', precision: 18, scale: 2 })
  amountCurrency2: number;

  @ApiProperty({
    description: 'Cost price for the operation',
    example: 1.085000,
  })
  @Column({ name: 'cost_price', type: 'numeric', precision: 18, scale: 6 })
  costPrice: number;

  @ApiProperty({
    description: 'Margin applied to the operation',
    example: 0.0020,
  })
  @Column({ type: 'numeric', precision: 8, scale: 4 })
  margin: number;

  @ApiProperty({
    description: 'Client price for the operation',
    example: 1.087000,
  })
  @Column({ name: 'client_price', type: 'numeric', precision: 18, scale: 6 })
  clientPrice: number;

  @ApiProperty({
    description: 'Start date of the operation',
    example: '2024-01-15',
  })
  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'Registration date of the operation',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'register_date', type: 'timestamp', default: () => 'NOW()' })
  registerDate: Date;

  @ApiProperty({
    description: 'Value date of the operation',
    example: '2024-01-17',
  })
  @Column({ name: 'value_date', type: 'date' })
  valueDate: Date;

  @ApiPropertyOptional({
    description: 'Payment method for currency 1',
    example: 'WIRE_TRANSFER',
    maxLength: 30,
  })
  @Column({ name: 'payment_method_currency1', type: 'varchar', length: 30, nullable: true })
  paymentMethodCurrency1: string;

  @ApiPropertyOptional({
    description: 'Payment method for currency 2',
    example: 'CASH',
    maxLength: 30,
  })
  @Column({ name: 'payment_method_currency2', type: 'varchar', length: 30, nullable: true })
  paymentMethodCurrency2: string;

  @ApiProperty({
    description: 'Operation side',
    example: OperationSide.BUY,
    enum: OperationSide,
  })
  @Column({ name: 'operation_side', type: 'enum', enum: OperationSide })
  operationSide: OperationSide;

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
    description: 'Origin of the quote',
    example: 1,
  })
  @Column({ name: 'origin_id', type: 'integer' })
  originId: number;

  @ApiProperty({
    description: 'Client segment ID',
    example: 1,
  })
  @Column({ name: 'segment_id', type: 'integer' })
  segmentId: number;

  @ApiPropertyOptional({
    description: 'Destination system ID',
    example: 123,
  })
  @Column({ name: 'destination_system_id', type: 'integer', nullable: true })
  destinationSystemId: number;

  @ApiPropertyOptional({
    description: 'Source system ID',
    example: 456,
  })
  @Column({ name: 'source_system_id', type: 'integer', nullable: true })
  sourceSystemId: number;

  @ApiPropertyOptional({
    description: 'Operation comments',
    example: 'Special client operation',
  })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @ApiPropertyOptional({
    description: 'Trading folder ID',
    example: 1,
  })
  @Column({ name: 'trading_folder_id', type: 'integer', nullable: true })
  tradingFolderId: number;

  @ApiPropertyOptional({
    description: 'Sales folder ID',
    example: 2,
  })
  @Column({ name: 'sales_folder_id', type: 'integer', nullable: true })
  salesFolderId: number;

  @ApiPropertyOptional({
    description: 'Calculated PnL',
    example: 2000.00,
  })
  @Column({ name: 'pnl_calculated', type: 'numeric', precision: 18, scale: 2, nullable: true })
  pnlCalculated: number;

  @ApiPropertyOptional({
    description: 'Current workflow step',
    example: 'PENDING_APPROVAL',
    maxLength: 30,
  })
  @Column({ name: 'workflow_step', type: 'varchar', length: 30, nullable: true })
  workflowStep: string;

  @ApiProperty({
    description: 'Operation status ID',
    example: 2,
    default: 2,
  })
  @Column({ name: 'status_id', type: 'integer', default: 2 })
  statusId: number;

  @ApiProperty({
    description: 'ID of user who created this record',
    example: 1,
  })
  @Column({ name: 'created_by', type: 'integer' })
  createdBy: number;

  @ApiProperty({
    description: 'Date when operation was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'ID of user who last modified this record',
    example: 1,
  })
  @Column({ name: 'modified_by', type: 'integer', nullable: true })
  modifiedBy: number | null;

  @ApiPropertyOptional({
    description: 'Date when operation was last modified',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date | null;

  // Relations
  @ApiProperty({
    description: 'Client information',
    type: () => Client,
  })
  @ManyToOne(() => Client, { nullable: false, eager: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ApiProperty({
    description: 'User who registered the operation',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @ApiPropertyOptional({
    description: 'Trading folder information',
    type: () => OperationFolder,
  })
  @ManyToOne(() => OperationFolder, { nullable: true, eager: false })
  @JoinColumn({ name: 'trading_folder_id' })
  tradingFolder: OperationFolder;

  @ApiPropertyOptional({
    description: 'Sales folder information',
    type: () => OperationFolder,
  })
  @ManyToOne(() => OperationFolder, { nullable: true, eager: false })
  @JoinColumn({ name: 'sales_folder_id' })
  salesFolder: OperationFolder;

  @ApiProperty({
    description: 'Operation status information',
    type: () => FxOperationStatus,
  })
  @ManyToOne(() => FxOperationStatus, { nullable: false, eager: false })
  @JoinColumn({ name: 'status_id' })
  status: FxOperationStatus;

  @ApiPropertyOptional({
    description: 'User who created this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ApiPropertyOptional({
    description: 'User who last modified this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'modified_by' })
  modifier: User;
}