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

@Index("fx_price_pkey", ["id"], { unique: true })
@Entity("fx_price", { schema: "public" })
export class FxPrice {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "price_date" })
  priceDate: string;

  @Column("numeric", {
    name: "price_bid",
    nullable: true,
    precision: 18,
    scale: 6,
  })
  priceBid: string | null;

  @Column("numeric", {
    name: "price_mid",
    nullable: true,
    precision: 18,
    scale: 6,
  })
  priceMid: string | null;

  @Column("numeric", {
    name: "price_offer",
    nullable: true,
    precision: 18,
    scale: 6,
  })
  priceOffer: string | null;

  @Column("character varying", {
    name: "info_source",
    nullable: true,
    length: 50,
  })
  infoSource: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Currency, (currency) => currency.fxPrices)
  @JoinColumn([{ name: "currency_id", referencedColumnName: "id" }])
  currency: Currency;

  @ManyToOne(() => FxProduct, (fxProduct) => fxProduct.fxPrices)
  @JoinColumn([{ name: "fx_product_id", referencedColumnName: "id" }])
  fxProduct: FxProduct;
}
