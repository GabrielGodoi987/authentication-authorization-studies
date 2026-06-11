jest.mock("../../../../src/database/source", () => ({
  getDataSource: jest.fn(),
}));

import { cartSeeder } from "../../../../src/database/seeds/cart.seed";
import { getDataSource } from "../../../../src/database/source";

describe("cartSeeder", () => {
  const userId = "test-user-id";
  let mockProductRepo: {
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let mockCartRepo: { save: jest.Mock };
  let mockDataSource: { getRepository: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockProductRepo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockCartRepo = {
      save: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn((entity: any) => {
        if (entity.name === "CartPersistenceEntity") return mockCartRepo;
        return mockProductRepo;
      }),
    };

    (getDataSource as jest.Mock).mockReturnValue(mockDataSource);
  });

  it("creates carts using existing products", async () => {
    const existingProducts = [
      { id: "prod-1", name: "Product A", price: 10 },
      { id: "prod-2", name: "Product B", price: 20 },
      { id: "prod-3", name: "Product C", price: 30 },
    ];
    mockProductRepo.find.mockResolvedValue(existingProducts);
    mockCartRepo.save.mockResolvedValue([]);

    const result = await cartSeeder({ userId });

    expect(result.success).toBe(true);
    expect(mockProductRepo.find).toHaveBeenCalledTimes(1);
    expect(mockProductRepo.create).not.toHaveBeenCalled();
    expect(mockCartRepo.save).toHaveBeenCalledTimes(1);
    expect(result.message).toContain("Seeded 2 carts");
  });

  it("creates fallback products when none exist", async () => {
    mockProductRepo.find.mockResolvedValue([]);
    mockProductRepo.create.mockImplementation((data: any) => data);
    mockProductRepo.save.mockImplementation((products: any) => products);
    mockCartRepo.save.mockResolvedValue([]);

    const result = await cartSeeder({ userId });

    expect(result.success).toBe(true);
    expect(mockProductRepo.find).toHaveBeenCalledTimes(1);
    expect(mockProductRepo.create).toHaveBeenCalled();
    expect(mockProductRepo.save).toHaveBeenCalled();
  });

  it("handles errors gracefully", async () => {
    mockProductRepo.find.mockRejectedValue(new Error("Connection failed"));

    const result = await cartSeeder({ userId });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Failed to seed carts");
  });
});
