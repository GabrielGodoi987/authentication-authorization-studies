import { v4 } from "uuid";
import { UserEntity } from "../../../src/domain/entities/user.entity";
import { TokenProvider } from "../../../src/services/auth.use-cases";
import { context } from "../../helpers/context";

describe("TokenProvicer class - unit test", () => {
  context("Access Token", () => {
    it("should generate a valid jwt token", () => {});
  });
  context("Refresh Access Token", () => {
    let user: UserEntity;
    beforeEach(() => {
      user = new UserEntity(
        v4(),
        "Example name",
        "exampleUser@email.com",
        "Example1",
      );
    });

    it("should generate a valid jwt refresh token", () => {
      const token = TokenProvider.generateRefreshToken({
        name: user.getName(),
        email: user.getEmail(),
      });
    });
  });
});
