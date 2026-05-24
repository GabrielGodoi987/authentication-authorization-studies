import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartPersistenceEntity } from "./cart-persistence.entity";

@Entity("cart_products")
export class CartProductPersistenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cartId" })
  cartId: string;

  @Column({ name: "productId" })
  productId: string;

  @Column()
  productName: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "float" })
  price: number;

  @ManyToOne(() => CartPersistenceEntity, (cart) => cart.cartProducts)
  @JoinColumn({ name: "cartId" })
  cart: CartPersistenceEntity;
}
