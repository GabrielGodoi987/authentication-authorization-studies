import { CartPersistenceEntity } from "../../../../src/infrastructure/persistence/cart-persistence.entity";
import { WhereSpecification } from "../../../../src/lib/specifications-base/base.specifications";
import { CartItemsEntity } from "../../../../src/domain/entities/cart-items.entity";
import { CartEntity } from "../../../../src/domain/entities/cart.entity";
import { CartRepository } from "../../../../src/domain/repositories/cart.repository";
import {
  FindAllCartsSpec,
  FindCartByIdSpec,
  FindCartByUserIdSpec,
} from "../../../../src/domain/specifications/cart.specifications";

class FakeCartRepository implements CartRepository {
  private carts: CartEntity[] = [];
  private products: CartItemsEntity[] = [];

  async save(cart: CartEntity): Promise<CartEntity> {
    this.carts.push(cart);
    return cart;
  }

  async findOne(
    spec: WhereSpecification<CartPersistenceEntity>,
  ): Promise<CartEntity | null> {
    return (
      this.carts.find((cart) =>
        spec.isSatisfiedBy(this.toPersistenceEntity(cart)),
      ) ?? null
    );
  }

  async find(
    spec: WhereSpecification<CartPersistenceEntity>,
  ): Promise<CartEntity[]> {
    return this.carts.filter((cart) =>
      spec.isSatisfiedBy(this.toPersistenceEntity(cart)),
    );
  }

  async delete(id: string): Promise<boolean> {
    const sizeBefore = this.carts.length;
    this.carts = this.carts.filter((cart) => cart.getId() !== id);
    await this.deleteProductsByCartId(id);
    return this.carts.length < sizeBefore;
  }

  async saveProduct(product: CartItemsEntity): Promise<CartItemsEntity> {
    const index = this.products.findIndex(
      (item) => item.getId() === product.getId(),
    );

    if (index >= 0) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }

    return product;
  }

  async findProductsByCartId(cartId: string): Promise<CartItemsEntity[]> {
    return this.products.filter((product) => product.getCartId() === cartId);
  }

  async findProductInCart(
    cartId: string,
    productId: string,
  ): Promise<CartItemsEntity | null> {
    return (
      this.products.find(
        (product) =>
          product.getCartId() === cartId &&
          product.getProductId() === productId,
      ) ?? null
    );
  }

  async deleteProduct(id: string): Promise<boolean> {
    const sizeBefore = this.products.length;
    this.products = this.products.filter((product) => product.getId() !== id);
    return this.products.length < sizeBefore;
  }

  async deleteProductsByCartId(cartId: string): Promise<boolean> {
    const sizeBefore = this.products.length;
    this.products = this.products.filter(
      (product) => product.getCartId() !== cartId,
    );
    return this.products.length < sizeBefore;
  }

  private toPersistenceEntity(cart: CartEntity): CartPersistenceEntity {
    return Object.assign(new CartPersistenceEntity(), {
      id: cart.getId(),
      userId: cart.getUserId(),
      price: cart.getPrice(),
      cartItems: cart.getCartItems(),
    });
  }
}

describe("CartRepository interface contract", () => {
  const makeCart = (id = "cart-id", userId = "user-id") =>
    new CartEntity(id, userId);

  const makeCartItem = (
    id = "cart-item-id",
    productId = "product-id",
    cartId = "cart-id",
  ) => new CartItemsEntity(id, productId, 2, 10, cartId);

  it("should support saving and finding carts by specification", async () => {
    const repo: CartRepository = new FakeCartRepository();
    const cart = makeCart();

    await repo.save(cart);

    await expect(repo.findOne(new FindCartByIdSpec(cart.getId()))).resolves.toBe(
      cart,
    );
    await expect(
      repo.findOne(new FindCartByUserIdSpec(cart.getUserId())),
    ).resolves.toBe(cart);
    await expect(repo.find(new FindAllCartsSpec())).resolves.toEqual([cart]);
  });

  it("should support cart product operations", async () => {
    const repo: CartRepository = new FakeCartRepository();
    const cart = makeCart();
    const item = makeCartItem();
    const updatedItem = new CartItemsEntity(
      item.getId(),
      item.getProductId(),
      3,
      10,
      item.getCartId(),
    );

    await repo.save(cart);
    await repo.saveProduct(item);

    await expect(repo.findProductsByCartId(cart.getId())).resolves.toEqual([
      item,
    ]);
    await expect(
      repo.findProductInCart(cart.getId(), item.getProductId()),
    ).resolves.toBe(item);

    await repo.saveProduct(updatedItem);

    await expect(
      repo.findProductInCart(cart.getId(), item.getProductId()),
    ).resolves.toBe(updatedItem);
    await expect(repo.deleteProduct(item.getId())).resolves.toBe(true);
    await expect(repo.findProductsByCartId(cart.getId())).resolves.toEqual([]);
  });

  it("should support deleting carts and their products", async () => {
    const repo: CartRepository = new FakeCartRepository();
    const cart = makeCart();
    const item = makeCartItem();

    await repo.save(cart);
    await repo.saveProduct(item);

    await expect(repo.delete(cart.getId())).resolves.toBe(true);
    await expect(repo.findOne(new FindCartByIdSpec(cart.getId()))).resolves.toBe(
      null,
    );
    await expect(repo.findProductsByCartId(cart.getId())).resolves.toEqual([]);
  });
});
