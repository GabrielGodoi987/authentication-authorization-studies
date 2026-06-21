import { v4 } from "uuid";
import { UserEntity } from "../domain/entities/user.entity";
import { type UserRepository } from "../domain/repositories/user.repository";
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

    return this.userRepo.save(entity);
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
    const user = await this.userRepo.findOne(new FindUserByIdSpec(id));

    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }

    const updatedUser = new UserEntity(
      user.getId(),
      data.name ?? user.getName(),
      data.email ?? user.getEmail(),
      data.password ?? user.getPassword(),
    );

    return this.userRepo.update(id, updatedUser);
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<boolean> {
    const user = await this.userRepo.findOne(new FindUserByIdSpec(id));

    if (!user) {
      throw new UserNotFoundException({
        message: "User was not found",
      });
    }

    return this.userRepo.delete(id);
  }
}
