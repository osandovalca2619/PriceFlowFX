import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FxPrice } from "./FxPrice";
import { SalesSpread } from "./SalesSpread";

@Index("fx_product_pkey", ["id"], { unique: true })
@Entity("fx_product", { schema: "public" })
export class FxProduct {
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

  @OneToMany(() => FxPrice, (fxPrice) => fxPrice.fxProduct)
  fxPrices: FxPrice[];

  @OneToMany(() => SalesSpread, (salesSpread) => salesSpread.fxProduct)
  salesSpreads: SalesSpread[];
}
