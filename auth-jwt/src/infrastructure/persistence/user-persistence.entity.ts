import bcrypt from "bcrypt";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class UserPersistenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
