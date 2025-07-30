import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SalesSpread } from "./SalesSpread";

@Index("quote_origin_pkey", ["id"], { unique: true })
@Entity("quote_origin", { schema: "public" })
export class QuoteOrigin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 30 })
  name: string;

  @OneToMany(() => SalesSpread, (salesSpread) => salesSpread.origin)
  salesSpreads: SalesSpread[];
}
