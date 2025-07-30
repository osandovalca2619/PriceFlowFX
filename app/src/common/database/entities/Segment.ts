import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SalesSpread } from "./SalesSpread";

@Index("segment_pkey", ["id"], { unique: true })
@Entity("segment", { schema: "public" })
export class Segment {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 30 })
  name: string;

  @OneToMany(() => SalesSpread, (salesSpread) => salesSpread.segment)
  salesSpreads: SalesSpread[];
}
