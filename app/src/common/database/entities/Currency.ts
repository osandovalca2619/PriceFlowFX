import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FxPrice } from "./FxPrice";
import { SalesSpread } from "./SalesSpread";
import { TradingSpreadRange } from "./TradingSpreadRange";

@Index("currency_code_key", ["code"], { unique: true })
@Index("currency_pkey", ["id"], { unique: true })
@Entity("currency", { schema: "public" })
export class Currency {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 3 })
  code: string;

  @Column("character varying", { name: "name", length: 50 })
  name: string;

  @Column("boolean", { name: "is_strong_currency" })
  isStrongCurrency: boolean;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @OneToMany(() => FxPrice, (fxPrice) => fxPrice.currency)
  fxPrices: FxPrice[];

  @OneToMany(() => SalesSpread, (salesSpread) => salesSpread.baseCurrency)
  salesSpreads: SalesSpread[];

  @OneToMany(() => SalesSpread, (salesSpread) => salesSpread.quoteCurrency)
  salesSpreads2: SalesSpread[];

  @OneToMany(
    () => TradingSpreadRange,
    (tradingSpreadRange) => tradingSpreadRange.currency
  )
  tradingSpreadRanges: TradingSpreadRange[];
}
