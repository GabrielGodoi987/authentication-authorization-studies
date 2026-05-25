import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartPersistenceEntity } from "./cart-persistence.entity";
import { ProductPersistenceEntity } from "./product-persistence.entity";

@Entity("cart_items")
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

  @ManyToOne(() => ProductPersistenceEntity)
  @JoinColumn({ name: "productId" })
  product: ProductPersistenceEntity;

  @BeforeInsert()
  calculatePrice() {
    this.price = this.quantity * this.price;
  }
}
