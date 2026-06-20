import { UserPersistenceEntity } from "../../../../src/infrastructure/persistence/user-persistence.entity";
import { Specification } from "../../../../src/lib/specifications-base/base.specifications";
import { UserEntity } from "../../../../src/domain/entities/user.entity";
import { UserRepository } from "../../../../src/domain/repositories/user.repository";
import {
  FindAllUsersSpec,
  FindUserByEmailSpec,
  FindUserByIdSpec,
} from "../../../../src/domain/specifications/user.specifications";

class FakeUserRepository implements UserRepository {
  private users: UserEntity[] = [];

  async save(data: UserEntity): Promise<UserEntity> {
    this.users.push(data);
    return data;
  }

  async findOne(
    spec: Specification<UserPersistenceEntity>,
  ): Promise<UserEntity | null> {
    return (
      this.users.find((user) =>
        spec.isSatisfiedBy(this.toPersistenceEntity(user)),
      ) ?? null
    );
  }

  async find(spec: Specification<UserPersistenceEntity>): Promise<UserEntity[]> {
    return this.users.filter((user) =>
      spec.isSatisfiedBy(this.toPersistenceEntity(user)),
    );
  }

  async update(id: string, data: UserEntity): Promise<UserEntity | null> {
    const index = this.users.findIndex((user) => user.getId() === id);
    if (index === -1) return null;

    this.users[index] = data;
    return data;
  }

  async delete(id: string): Promise<boolean> {
    const sizeBefore = this.users.length;
    this.users = this.users.filter((user) => user.getId() !== id);
    return this.users.length < sizeBefore;
  }

  private toPersistenceEntity(user: UserEntity): UserPersistenceEntity {
    return Object.assign(new UserPersistenceEntity(), {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      deletedAt: null,
    });
  }
}

describe("UserRepository interface contract", () => {
  const makeUser = (
    id = "user-id",
    email = "john.doe@email.com",
    name = "John Doe",
  ) => new UserEntity(id, name, email, "StrongPassword123");

  it("should support saving and finding users by specification", async () => {
    const repo: UserRepository = new FakeUserRepository();
    const user = makeUser();

    await repo.save(user);

    await expect(repo.findOne(new FindUserByIdSpec(user.getId()))).resolves.toBe(
      user,
    );
    await expect(
      repo.findOne(new FindUserByEmailSpec(user.getEmail())),
    ).resolves.toBe(user);
    await expect(repo.find(new FindAllUsersSpec())).resolves.toEqual([user]);
  });

  it("should support updating and deleting users", async () => {
    const repo: UserRepository = new FakeUserRepository();
    const user = makeUser();
    const updated = makeUser(user.getId(), "jane.doe@email.com", "Jane Doe");

    await repo.save(user);

    await expect(repo.update(user.getId(), updated)).resolves.toBe(updated);
    await expect(
      repo.findOne(new FindUserByEmailSpec("jane.doe@email.com")),
    ).resolves.toBe(updated);
    await expect(repo.delete(user.getId())).resolves.toBe(true);
    await expect(repo.findOne(new FindUserByIdSpec(user.getId()))).resolves.toBe(
      null,
    );
  });
});
