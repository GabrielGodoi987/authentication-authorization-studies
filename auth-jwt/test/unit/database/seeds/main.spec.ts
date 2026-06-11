jest.mock("../../../../src/database/seeds/user.seed", () => ({
  seedUsers: jest.fn(),
}));

jest.mock("../../../../src/database/seeds/product.seed", () => ({
  productSeeder: jest.fn(),
}));

jest.mock("../../../../src/database/seeds/cart.seed", () => ({
  cartSeeder: jest.fn(),
}));

import { MainSeeder } from "../../../../src/database/seeds/main";
import { seedUsers } from "../../../../src/database/seeds/user.seed";
import { productSeeder } from "../../../../src/database/seeds/product.seed";
import { cartSeeder } from "../../../../src/database/seeds/cart.seed";

describe("MainSeeder", () => {
  const mockUsers = [
    { id: "user-1", email: "user1@test.com" },
    { id: "user-2", email: "user2@test.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls seedUsers, productSeeder, and cartSeeder for each user", async () => {
    (seedUsers as jest.Mock).mockResolvedValue({
      message: "Seeded 2 users",
      users: mockUsers,
    });
    (productSeeder as jest.Mock).mockResolvedValue({ success: true });
    (cartSeeder as jest.Mock).mockResolvedValue({ success: true, message: "seeded" });

    await MainSeeder();

    expect(seedUsers).toHaveBeenCalledTimes(1);
    expect(productSeeder).toHaveBeenCalledTimes(1);
    expect(cartSeeder).toHaveBeenCalledTimes(mockUsers.length);
    expect(cartSeeder).toHaveBeenCalledWith({ userId: "user-1" });
    expect(cartSeeder).toHaveBeenCalledWith({ userId: "user-2" });
  });

  it("stops early when seedUsers returns no users", async () => {
    (seedUsers as jest.Mock).mockResolvedValue({
      message: "No users",
      users: undefined,
    });

    const result = await MainSeeder();

    expect(productSeeder).not.toHaveBeenCalled();
    expect(cartSeeder).not.toHaveBeenCalled();
    expect(result.message).toBe("No users");
  });

  it("aggregates success results", async () => {
    (seedUsers as jest.Mock).mockResolvedValue({
      message: "Seeded 2 users",
      users: mockUsers,
    });
    (productSeeder as jest.Mock).mockResolvedValue({ success: true });
    (cartSeeder as jest.Mock)
      .mockResolvedValueOnce({ success: true, message: "cart seeded 1" })
      .mockResolvedValueOnce({ success: true, message: "cart seeded 2" });

    const result = await MainSeeder();

    expect(result.data!.success.quantity).toBe(2);
    expect(result.data!.success.messages).toEqual([
      "cart seeded 1",
      "cart seeded 2",
    ]);
  });

  it("aggregates failure results", async () => {
    (seedUsers as jest.Mock).mockResolvedValue({
      message: "Seeded 2 users",
      users: mockUsers,
    });
    (productSeeder as jest.Mock).mockResolvedValue({ success: true });
    (cartSeeder as jest.Mock)
      .mockResolvedValueOnce({ success: false, message: "failed for user 1" })
      .mockResolvedValueOnce({ success: true, message: "cart seeded 2" });

    const result = await MainSeeder();

    expect(result.data!.fail.quantity).toBe(1);
    expect(result.data!.fail.messages).toEqual(["failed for user 1"]);
    expect(result.data!.success.quantity).toBe(1);
  });
});
