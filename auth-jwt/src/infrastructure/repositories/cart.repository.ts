import { AppDataSource } from "../../database/source";
import { CartItemsEntity } from "../../domain/entities/cart-items.entity";
import { CartEntity } from "../../domain/entities/cart.entity";
import { type CartRepository } from "../../domain/repositories/cart.repository";
import { WhereSpecification } from "../../lib/specifications-base/base.specifications";
import { CartMapper } from "../mappers/cart.mapper";
import { CartItemsPersistenceEntity } from "../persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../persistence/cart-persistence.entity";

export class CartRepositoryImpl implements CartRepository {
  private getCartRepo() {
    return AppDataSource.getRepository(CartPersistenceEntity);
  }

  private getCartProductRepo() {
    return AppDataSource.getRepository(CartItemsPersistenceEntity);
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    const repo = this.getCartRepo();
    const data = CartMapper.toPersistence(cart);
    const model = repo.create(data);
    const saved = await repo.save(model);
    return CartMapper.toDomain(saved);
  }

  async findOne(
    spec: WhereSpecification<CartPersistenceEntity>,
  ): Promise<CartEntity | null> {
    const model = await this.getCartRepo().findOne({
      where: spec.toWhere(),
      relations: ["cartProducts"],
    });

    return model ? CartMapper.toDomain(model) : null;
  }

  async find(
    spec: WhereSpecification<CartPersistenceEntity>,
  ): Promise<CartEntity[]> {
    const models = await this.getCartRepo().find({
      where: spec.toWhere() as any,
      relations: ["cartProducts"],
    });
    return models.map((m) => CartMapper.toDomain(m));
  }

  async delete(id: string): Promise<boolean> {
    await this.getCartProductRepo().delete({ cartId: id });
    const result = await this.getCartRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }

  async saveProduct(product: CartItemsEntity): Promise<CartItemsEntity> {
    const repo = this.getCartProductRepo();
    const data = CartMapper.cartProductToPersistence(product);
    const model = repo.create(data as CartItemsPersistenceEntity);

    const existing = await repo.findOne({
      where: {
        cartId: product.getCartId(),
        productId: product.getProductId(),
      },
    });

    if (existing) {
      existing.quantity = product.getQuantity();
      existing.value = product.getPrice();
      const saved = await repo.save(existing);
      return CartMapper.cartProductToDomain(saved);
    }

    const saved = await repo.save(model);
    return CartMapper.cartProductToDomain(saved);
  }

  async findProductsByCartId(cartId: string): Promise<CartItemsEntity[]> {
    const models = await this.getCartProductRepo().find({
      where: { cartId },
    });
    return models.map((m) => CartMapper.cartProductToDomain(m));
  }

  async findProductInCart(
    cartId: string,
    productId: string,
  ): Promise<CartItemsEntity | null> {
    const model = await this.getCartProductRepo().findOne({
      where: { cartId, productId },
    });
    return model ? CartMapper.cartProductToDomain(model) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.getCartProductRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteProductsByCartId(cartId: string): Promise<boolean> {
    const result = await this.getCartProductRepo().delete({ cartId });
    return (result.affected ?? 0) > 0;
  }
}
