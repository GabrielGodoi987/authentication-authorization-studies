import { v4 } from "uuid";
import { UserEntity } from "../../../src/domain/entities/user.entity";
import { UserMapper } from "../../../src/infrastructure/mappers/user.mapper";
import { UserPersistenceEntity } from "../../../src/infrastructure/persistence/user-persistence.entity";

function makePersistence(
  overrides: Partial<UserPersistenceEntity> = {},
): UserPersistenceEntity {
  const entity = new UserPersistenceEntity();
  entity.id = overrides.id ?? "550e8400-e29b-41d4-a716-446655440000";
  entity.name = overrides.name ?? "John Doe";
  entity.email = overrides.email ?? "john@doe.com";
  entity.password = overrides.password ?? "Strong1Pass";
  return entity;
}

function makeDomain(
  overrides: Partial<{
    id: string;
    name: string;
    email: string;
    password: string;
  }> = {},
): UserEntity {
  return new UserEntity(
    v4(),
    overrides.name ?? "John Doe",
    overrides.email ?? "john@doe.com",
    overrides.password ?? "Strong1Pass",
  );
}

describe("UserMapper - unit test", () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe("toDomain", () => {
    it("maps a persistence user to a domain user", () => {
      const persistence = makePersistence();
      const domain = mapper.toDomain(persistence);

      expect(domain).toBeInstanceOf(UserEntity);
      expect(domain.getName()).toBe(persistence.name);
      expect(domain.getEmail()).toBe(persistence.email);
      expect(domain.getPassword()).toBe(persistence.password);
    });
  });

  describe("toPersistence", () => {
    it('maps a domain entity to a persistence entity with "id" field', () => {
      const domain = makeDomain();
      const persistence = mapper.toPersistence({
        getId: () => "abc-123",
        getName: domain.getName.bind(domain),
        getEmail: domain.getEmail.bind(domain),
        getPassword: domain.getPassword.bind(domain),
      });

      expect(persistence.id).toBe("abc-123");
      expect(persistence.name).toBe("John Doe");
      expect(persistence.email).toBe("john@doe.com");
      expect(typeof persistence.password).toBe("string");
    });

    it('maps a domain entity to a persistence entity without "id" field', () => {
      const domain = makeDomain();
      const persistence = mapper.toPersistence({
        getName: domain.getName.bind(domain),
        getEmail: domain.getEmail.bind(domain),
        getPassword: domain.getPassword.bind(domain),
      });

      expect(persistence.id).toBeUndefined();
      expect(persistence.name).toBe("John Doe");
      expect(persistence.email).toBe("john@doe.com");
      expect(typeof persistence.password).toBe("string");
    });
  });
});
