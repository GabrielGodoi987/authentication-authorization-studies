import { Column, Entity, OneToMany } from "typeorm";
import { BasePersistenceEntity } from "./base-typeORM/base-persistence.entity";
import { CartItemsPersistenceEntity } from "./cart-items-persistence.entity";

@Entity("carts")
export class CartPersistenceEntity extends BasePersistenceEntity {
  @Column({ name: "userId" })
  userId: string;

  @Column({ type: "float", default: 0 })
  price: number;

  @OneToMany(() => CartItemsPersistenceEntity, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  cartItems: CartItemsPersistenceEntity[];
}
