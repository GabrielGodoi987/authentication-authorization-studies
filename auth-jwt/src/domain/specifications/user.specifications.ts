import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";

export interface UserSpecification {
  toWhere(): Partial<UserPersistenceEntity>;
}

export class FindUserByIdSpec implements UserSpecification {
  constructor(private readonly id: string) {}

  toWhere(): Partial<UserPersistenceEntity> {
    return { id: this.id };
  }
}

export class FindUserByEmailSpec implements UserSpecification {
  constructor(private readonly email: string) {}

  toWhere(): Partial<UserPersistenceEntity> {
    return { email: this.email as unknown as UserPersistenceEntity["email"] };
  }
}

export class FindAllUsersSpec implements UserSpecification {
  toWhere(): Partial<UserPersistenceEntity> {
    return {};
  }
}
