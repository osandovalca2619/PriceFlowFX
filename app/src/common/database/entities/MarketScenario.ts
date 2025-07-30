import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TradingSpreadRange } from "./TradingSpreadRange";

@Index("market_scenario_pkey", ["id"], { unique: true })
@Entity("market_scenario", { schema: "public" })
export class MarketScenario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 20 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100,
  })
  description: string | null;

  @OneToMany(
    () => TradingSpreadRange,
    (tradingSpreadRange) => tradingSpreadRange.scenario
  )
  tradingSpreadRanges: TradingSpreadRange[];
}
