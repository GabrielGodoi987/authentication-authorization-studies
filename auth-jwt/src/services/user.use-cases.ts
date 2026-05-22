import { v4 } from "uuid";
import { UserEntity } from "../domain/entities/user.entity";
import { type UserRepository } from "../domain/repositorie/user.repository";
import {
  FindAllUsersSpec,
  FindUserByEmailSpec,
  FindUserByIdSpec,
} from "../domain/specifications/user.specifications";
import {
  UserAlreadyExistsExceptions,
  UserNotFoundException,
} from "../http/exceptions/user.exceptions";

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const existing = await this.userRepo.findOne(
      new FindUserByEmailSpec(data.email),
    );

    if (existing) {
      throw new UserAlreadyExistsExceptions({
        message: "User already exists",
      });
    }

    const entity = new UserEntity(v4(), data.name, data.email, data.password);

    return this.userRepo.save({
      name: entity.getName(),
      email: entity.getEmail(),
      password: entity.getPassword(),
    });
  }
}

export class FindUserByIdUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne(new FindUserByIdSpec(id));
    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }

    return user;
  }
}

export class FindUserByEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne(new FindUserByEmailSpec(email));
    if (!user) {
      throw new UserNotFoundException({
        message: "Cannot found user with email",
      });
    }

    return user;
  }
}

export class FindAllUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepo.find(new FindAllUsersSpec());
  }
}

export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
    }>,
  ): Promise<UserEntity | null> {
    try {
      await this.verifyIfUserExists(id);
      return this.userRepo.update(id, data);
    } catch (error: any) {
      console.error(error);
      return error.message;
    }
  }

  private async verifyIfUserExists(id: string) {
    const user = await this.userRepo.findOne(new FindUserByIdSpec(id));
    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<boolean> {
    await this.verifyIfUserExists(id);
    return this.userRepo.delete(id);
  }

  private async verifyIfUserExists(id: string) {
    const user = await this.userRepo.findOne(new FindUserByIdSpec(id));
    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }
  }
}
