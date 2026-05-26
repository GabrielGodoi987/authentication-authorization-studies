import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasePersistenceEntity } from "./base-typeORM/base-persistence.entity";
import { CartPersistenceEntity } from "./cart-persistence.entity";
import { ProductPersistenceEntity } from "./product-persistence.entity";

@Entity("cart_items")
export class CartItemsPersistenceEntity extends BasePersistenceEntity {
  @Column({ name: "cartId" })
  cartId: string;

  @Column({ name: "productId" })
  productId: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "float" })
  value: number;

  @ManyToOne(() => CartPersistenceEntity, (cart) => cart.cartItems)
  @JoinColumn({ name: "cartId" })
  cart: CartPersistenceEntity;

  @ManyToOne(() => ProductPersistenceEntity)
  @JoinColumn({ name: "productId" })
  product: ProductPersistenceEntity;
}
