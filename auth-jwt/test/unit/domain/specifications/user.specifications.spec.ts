import { UserPersistenceEntity } from "../../../../src/infrastructure/persistence/user-persistence.entity";
import {
  FindAllUsersSpec,
  FindUserByEmailSpec,
  FindUserByIdSpec,
} from "../../../../src/domain/specifications/user.specifications";

function makeUserPersistence(
  overrides: Partial<UserPersistenceEntity> = {},
): UserPersistenceEntity {
  return Object.assign(new UserPersistenceEntity(), {
    id: "user-id",
    name: "John Doe",
    email: "john.doe@email.com",
    password: "hashed-password",
    deletedAt: null,
    ...overrides,
  });
}

describe("User specifications", () => {
  describe("FindUserByIdSpec", () => {
    it("should match users by id", () => {
      const spec = new FindUserByIdSpec("user-id");

      expect(spec.isSatisfiedBy(makeUserPersistence())).toBe(true);
      expect(spec.isSatisfiedBy(makeUserPersistence({ id: "other-id" }))).toBe(
        false,
      );
    });

    it("should convert to where clause", () => {
      expect(new FindUserByIdSpec("user-id").toWhere()).toEqual({
        id: "user-id",
      });
    });
  });

  describe("FindUserByEmailSpec", () => {
    it("should match users by email", () => {
      const spec = new FindUserByEmailSpec("john.doe@email.com");

      expect(spec.isSatisfiedBy(makeUserPersistence())).toBe(true);
      expect(
        spec.isSatisfiedBy(makeUserPersistence({ email: "jane.doe@email.com" })),
      ).toBe(false);
    });

    it("should convert to where clause", () => {
      expect(new FindUserByEmailSpec("john.doe@email.com").toWhere()).toEqual({
        email: "john.doe@email.com",
      });
    });
  });

  describe("FindAllUsersSpec", () => {
    it("should match users that are not soft deleted", () => {
      const spec = new FindAllUsersSpec();

      expect(spec.isSatisfiedBy(makeUserPersistence({ deletedAt: null }))).toBe(
        true,
      );
      expect(
        spec.isSatisfiedBy(makeUserPersistence({ deletedAt: undefined })),
      ).toBe(true);
    });

    it("should not match soft deleted users", () => {
      const spec = new FindAllUsersSpec();

      expect(
        spec.isSatisfiedBy(makeUserPersistence({ deletedAt: new Date() })),
      ).toBe(false);
    });

    it("should convert to where clause", () => {
      expect(new FindAllUsersSpec().toWhere()).toEqual({
        deletedAt: null,
      });
    });
  });
});
