import { v4 } from "uuid";
import { CartProductEntity } from "../../domain/entities/cart-product.entity";
import { CartEntity } from "../../domain/entities/cart.entity";
import { getDataSource } from "../source";

export async function cartSeeder({ userId }: { userId: string }) {
  try {
    const dataSource = getDataSource();

    const repo = dataSource.getRepository(CartEntity);
    const carts: CartEntity[] = Array.from({ length: 2 }, (_, i) => {
      const cart = new CartEntity(`cart-${i + 1}`, userId);
      cart.addProduct(
        new CartProductEntity(
          v4(),
          cart.getId(),
          `product-${i + 1}`,
          `Product ${i + 1}`,
          (i + 1) * 2,
          (i + 1) * 10,
        ),
      );
      return cart;
    });
    repo.save(carts);

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
