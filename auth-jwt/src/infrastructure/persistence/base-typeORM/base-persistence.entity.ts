import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BasePersistenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "datetime",
    nullable: true,
  })
  deletedAt: Date | null;
}
