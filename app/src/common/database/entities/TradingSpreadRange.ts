import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currency } from "./Currency";
import { MarketScenario } from "./MarketScenario";

@Index("trading_spread_range_pkey", ["id"], { unique: true })
@Entity("trading_spread_range", { schema: "public" })
export class TradingSpreadRange {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("numeric", { name: "amount_min", precision: 18, scale: 2 })
  amountMin: string;

  @Column("numeric", { name: "amount_max", precision: 18, scale: 2 })
  amountMax: string;

  @Column("numeric", { name: "spread", precision: 8, scale: 4 })
  spread: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @ManyToOne(() => Currency, (currency) => currency.tradingSpreadRanges)
  @JoinColumn([{ name: "currency_id", referencedColumnName: "id" }])
  currency: Currency;

  @ManyToOne(
    () => MarketScenario,
    (marketScenario) => marketScenario.tradingSpreadRanges
  )
  @JoinColumn([{ name: "scenario_id", referencedColumnName: "id" }])
  scenario: MarketScenario;
}
