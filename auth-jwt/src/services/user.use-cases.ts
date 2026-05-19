import { UserEntity } from "../domain/entities/user.entity";
import {
  FindAllUsersSpec,
  FindUserByEmailSpec,
  FindUserByIdSpec,
} from "../domain/specifications/user.specifications";
import { type UserRepository } from "../domain/repositorie/user.repository";

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
      throw new Error("User already exists");
    }
    const entity = UserEntity.create(data.name, data.email, data.password);
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
    return this.userRepo.findOne(new FindUserByIdSpec(id));
  }
}

export class FindUserByEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne(new FindUserByEmailSpec(email));
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
    return this.userRepo.update(id, data);
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.userRepo.delete(id);
  }
}
