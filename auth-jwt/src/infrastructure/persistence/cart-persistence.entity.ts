import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartProductPersistenceEntity } from "./cart-product-persistence.entity";

@Entity("carts")
export class CartPersistenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ type: "float", default: 0 })
  price: number;

  @OneToMany(
    () => CartProductPersistenceEntity,
    (product) => product.cart,
    { cascade: true, eager: true },
  )
  cartProducts: CartProductPersistenceEntity[];
}
