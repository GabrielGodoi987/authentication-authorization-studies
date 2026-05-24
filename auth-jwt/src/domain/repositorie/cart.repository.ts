import { CartEntity } from "../entities/cart.entity";
import { CartProductEntity } from "../entities/cart-product.entity";
import { CartSpecification } from "../specifications/cart.specifications";

export interface CartRepository {
  save(cart: CartEntity): Promise<CartEntity>;
  findOne(spec: CartSpecification): Promise<CartEntity | null>;
  find(spec: CartSpecification): Promise<CartEntity[]>;
  delete(id: string): Promise<boolean>;
  saveProduct(product: CartProductEntity): Promise<CartProductEntity>;
  findProductsByCartId(cartId: string): Promise<CartProductEntity[]>;
  findProductInCart(
    cartId: string,
    productId: string,
  ): Promise<CartProductEntity | null>;
  deleteProduct(id: string): Promise<boolean>;
  deleteProductsByCartId(cartId: string): Promise<boolean>;
}
