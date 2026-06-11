import { cartSeeder } from "./cart.seed";
import { productSeeder } from "./product.seed";
import { seedUsers } from "./user.seed";

export async function MainSeeder() {
  const { message, users } = await seedUsers();

  if (!users) {
    return {
      message,
    };
  }

  await productSeeder();

  const messageHash: {
    fail: {
      quantity: number;
      userId: string[];
      messages: string[];
    };
    success: {
      quantity: number;
      userId: string[];
      messages: string[];
    };
  } = {
    fail: {
      quantity: 0,
      userId: [],
      messages: [],
    },
    success: {
      quantity: 0,
      userId: [],
      messages: [],
    },
  };

  for (const user of users) {
    const { message, success } = await cartSeeder({ userId: user.id });
    if (success) {
      messageHash.success.quantity++;
      messageHash.success.userId.push(user.id);
      messageHash.success.messages.push(message);
    }
    if (!success) {
      messageHash.fail.quantity++;
      messageHash.fail.userId.push(user.id);
      messageHash.fail.messages.push(message);
    }
  }

  return {
    message: "Seeding process completed",
    data: messageHash,
  };
}
