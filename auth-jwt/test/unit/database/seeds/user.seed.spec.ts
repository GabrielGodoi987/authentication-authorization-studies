jest.mock("bcrypt", () => ({
  hashSync: jest.fn(() => "hashed-password"),
}));

jest.mock("../../../../src/database/source", () => ({
  getDataSource: jest.fn(),
}));

import bcrypt from "bcrypt";
import { seedUsers } from "../../../../src/database/seeds/user.seed";
import { getDataSource } from "../../../../src/database/source";

describe("seedUsers", () => {
  let mockRepo: { count: jest.Mock; save: jest.Mock };
  let mockDataSource: { getRepository: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = {
      count: jest.fn(),
      save: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn(() => mockRepo),
    };

    (getDataSource as jest.Mock).mockReturnValue(mockDataSource);
  });

  it("skips seeding when users already exist", async () => {
    mockRepo.count.mockResolvedValue(5);

    const result = await seedUsers();

    expect(result.message).toContain("skipping seed");
    expect(result.users).toBeUndefined();
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it("creates users when database is empty", async () => {
    mockRepo.count.mockResolvedValue(0);
    mockRepo.save.mockImplementation((users: any[]) => users);

    const result = await seedUsers();

    expect(result.users).toBeDefined();
    expect(result.users!.length).toBeGreaterThan(0);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalled();
  });

  it("creates the specific Gabriel user", async () => {
    mockRepo.count.mockResolvedValue(0);
    mockRepo.save.mockImplementation((users: any[]) => users);

    const result = await seedUsers();

    const gabriel = result.users!.find(
      (u: { email: string }) => u.email === "gabrielGodoi@email.com",
    );
    expect(gabriel).toBeDefined();
  });

  it("returns an error message when save fails", async () => {
    mockRepo.count.mockResolvedValue(0);
    mockRepo.save.mockRejectedValue(new Error("DB connection lost"));

    const result = await seedUsers();

    expect(result.message).toContain("Failed to seed users");
    expect(result.users).toBeUndefined();
  });
});
