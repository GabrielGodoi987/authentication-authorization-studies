import bcrypt from "bcrypt";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmailValueObject } from "../value-objects/email.value-objects";
import { PasswordValueObject } from "../value-objects/password.value-objects";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "varchar",
    transformer: {
      from: (email: string) => new EmailValueObject(email),
      to: (email: EmailValueObject) => email.getEmail(),
    },
  })
  email: EmailValueObject;

  @Column({
    type: "varchar",
    transformer: {
      from: (password: string) => new PasswordValueObject(password),
      to: (password: PasswordValueObject) => password.getPassword(),
    },
  })
  password: PasswordValueObject;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = new PasswordValueObject(
        await bcrypt.hash(this.password.getPassword(), 10),
      );
    }
  }

  comparePassword(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.password.getPassword());
  }

  // return the user without the password
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getEmail(),
    };
  }
}
