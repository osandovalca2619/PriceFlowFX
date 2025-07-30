import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currency } from "./Currency";
import { FxProduct } from "./FxProduct";
import { QuoteOrigin } from "./QuoteOrigin";
import { Segment } from "./Segment";

@Index("sales_spread_pkey", ["id"], { unique: true })
@Entity("sales_spread", { schema: "public" })
export class SalesSpread {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", { name: "market_hours" })
  marketHours: boolean;

  @Column("numeric", { name: "spread_buy", precision: 8, scale: 4 })
  spreadBuy: string;

  @Column("numeric", { name: "spread_sell", precision: 8, scale: 4 })
  spreadSell: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @ManyToOne(() => Currency, (currency) => currency.salesSpreads)
  @JoinColumn([{ name: "base_currency_id", referencedColumnName: "id" }])
  baseCurrency: Currency;

  @ManyToOne(() => FxProduct, (fxProduct) => fxProduct.salesSpreads)
  @JoinColumn([{ name: "fx_product_id", referencedColumnName: "id" }])
  fxProduct: FxProduct;

  @ManyToOne(() => QuoteOrigin, (quoteOrigin) => quoteOrigin.salesSpreads)
  @JoinColumn([{ name: "origin_id", referencedColumnName: "id" }])
  origin: QuoteOrigin;

  @ManyToOne(() => Currency, (currency) => currency.salesSpreads2)
  @JoinColumn([{ name: "quote_currency_id", referencedColumnName: "id" }])
  quoteCurrency: Currency;

  @ManyToOne(() => Segment, (segment) => segment.salesSpreads)
  @JoinColumn([{ name: "segment_id", referencedColumnName: "id" }])
  segment: Segment;
}
