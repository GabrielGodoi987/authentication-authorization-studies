import { UserEntity } from "../../../src/domain/entities/user.entity";

const DEFAULT_PASSWORD = "Strong1Pass";

export function makeUser(
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
  }> = {},
): UserEntity {
  return UserEntity.create(
    overrides.name ?? "John Doe",
    overrides.email ?? "john@doe.com",
    overrides.password ?? DEFAULT_PASSWORD,
  );
}
