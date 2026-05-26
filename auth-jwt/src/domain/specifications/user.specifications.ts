import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";
import { Specification } from "../../lib/specifications-base/base.specifications";

export class FindUserByIdSpec extends Specification<UserPersistenceEntity> {
  constructor(private readonly id: string) {
    super();
  }

  isSatisfiedBy(candidate: UserPersistenceEntity): boolean {
    return candidate.id === this.id;
  }

  toWhere(): Partial<any> {
    return { id: this.id };
  }
}

export class FindUserByEmailSpec extends Specification<UserPersistenceEntity> {
  constructor(private readonly email: string) {
    super();
  }

  isSatisfiedBy(candidate: UserPersistenceEntity): boolean {
    return candidate.email === this.email;
  }

  toWhere(): Partial<any> {
    return { email: this.email };
  }
}

export class FindAllUsersSpec extends Specification<UserPersistenceEntity> {
  isSatisfiedBy(candidate: UserPersistenceEntity): boolean {
    return candidate.deletedAt === null || candidate.deletedAt === undefined;
  }

  toWhere(): Partial<any> {
    return { deletedAt: null };
  }
}
