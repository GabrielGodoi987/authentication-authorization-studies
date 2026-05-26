import bcrypt from "bcrypt";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { BasePersistenceEntity } from "./base-typeORM/base-persistence.entity";

@Entity("users")
export class UserPersistenceEntity extends BasePersistenceEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  comparePassword(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.password);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
