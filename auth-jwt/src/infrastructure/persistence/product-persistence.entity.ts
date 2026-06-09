import { Column, Entity, OneToMany } from "typeorm";
import { BasePersistenceEntity } from "./base-typeORM/base-persistence.entity";
import { CartItemsPersistenceEntity } from "./cart-items-persistence.entity";

@Entity("products")
export class ProductPersistenceEntity extends BasePersistenceEntity {
  @Column()
  name: string;

  @Column({ type: "float" })
  price: number;

  @OneToMany(() => CartItemsPersistenceEntity, (cartItem) => cartItem.product)
  cartItems: CartItemsPersistenceEntity[];
}
