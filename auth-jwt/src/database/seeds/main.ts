import { cartSeeder } from "./cart.seed";
import { seedUsers } from "./user.seed";

export async function MainSeeder() {
  const { message, users } = await seedUsers();

  if (!users) {
    return {
      message,
    };
  }

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
  } = {} as any;

  users.forEach(async (user) => {
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
  });

  return {
    message: "Seeding process completed",
    data: messageHash,
  };
}
