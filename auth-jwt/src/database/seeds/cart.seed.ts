import { v4 } from "uuid";
import { CartEntity } from "../../domain/entities/cart.entity";
import { CartMapper } from "../../infrastructure/mappers/cart.mapper";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";
import { CartItemsPersistenceEntity } from "../../infrastructure/persistence/cart-items-persistence.entity";
import { CartPersistenceEntity } from "../../infrastructure/persistence/cart-persistence.entity";
import { ProductPersistenceEntity } from "../../infrastructure/persistence/product-persistence.entity";
import { getDataSource } from "../source";

export async function cartSeeder({ userId }: { userId: string }) {
  try {
    const dataSource = getDataSource();

    const repo = dataSource.getRepository(CartPersistenceEntity);
    const productRepository = dataSource.getRepository(
      ProductPersistenceEntity,
    );

    let products = await productRepository.find();

    if (products.length === 0) {
      const newProducts = Array.from({ length: 5 }, (_, i) =>
        productRepository.create({
          id: v4(),
          name: `Product ${i + 1}`,
          price: (i + 1) * 10,
        }),
      );
      products = await productRepository.save(newProducts);
    }

    const shuffled = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

    const carts: CartEntity[] = Array.from({ length: 2 }, (_, i) => {
      const cart = new CartEntity(`cart-${i + 1}`, userId);
      const selectedProducts = shuffled(products).slice(
        0,
        Math.floor(Math.random() * products.length) + 1,
      );

      for (const productPersistence of selectedProducts) {
        const product = ProductMapper.toEntity(productPersistence);
        const quantity = Math.floor(Math.random() * 5) + 1;
        cart.addProduct(product, quantity);
      }

      return cart;
    });

    const cartPersistence = carts.map((cart) => {
      const persisted = CartMapper.toPersistence(cart);
      persisted.cartItems = cart
        .getCartItems()
        .map((ci) =>
          CartMapper.cartProductToPersistence(ci),
        ) as CartItemsPersistenceEntity[];
      return persisted;
    });

    await repo.save(cartPersistence);

    return {
      success: true,
      message: `🌱 Seeded ${carts.length} carts for user ${userId}`,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `❌ Failed to seed carts for user ${userId} -  ${error.message}`,
    };
  }
}
