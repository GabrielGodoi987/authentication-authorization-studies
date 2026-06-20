import { v4 } from "uuid";
import { UserEntity } from "../../../src/domain/entities/user.entity";

const STRONG_PASSWORD = "Strong1Pass";

export function makeUser(
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
  }> = {},
): UserEntity {
  return new UserEntity(
    v4(),
    overrides.name ?? "John Doe",
    overrides.email ?? "john@doe.com",
    overrides.password ?? STRONG_PASSWORD,
  );
}
