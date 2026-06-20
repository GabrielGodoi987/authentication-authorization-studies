jest.mock("../../../../src/database/source", () => ({
  getDataSource: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

import { productSeeder } from "../../../../src/database/seeds/product.seed";
import { getDataSource } from "../../../../src/database/source";

describe("productSeeder", () => {
  let mockRepo: { save: jest.Mock };
  let mockDataSource: { getRepository: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      save: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn(() => mockRepo),
    };

    (getDataSource as jest.Mock).mockReturnValue(mockDataSource);
  });

  it("should create and save 10 products", async () => {
    mockRepo.save.mockResolvedValue([]);

    const result = await productSeeder();

    expect(result.success).toBe(true);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(result.message).toContain("Seeded 10");

    const savedProducts = mockRepo.save.mock.calls[0][0];
    expect(savedProducts).toHaveLength(10);
    expect(savedProducts[0]).toMatchObject({
      id: "mocked-uuid",
      name: "Product 0",
      price: 12,
    });
    expect(savedProducts[9]).toMatchObject({
      id: "mocked-uuid",
      name: "Product 9",
      price: 12,
    });
  });

  it("should return an error message when save fails", async () => {
    jest.spyOn(console, "error").mockReturnValue();
    mockRepo.save.mockRejectedValue(new Error("DB connection lost"));

    const result = await productSeeder();

    expect(result.success).toBe(false);
    expect(result.message).toContain("Failed to seed products");
  });
});
