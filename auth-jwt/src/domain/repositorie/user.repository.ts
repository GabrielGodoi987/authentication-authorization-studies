import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";
import { Specification } from "../../lib/specifications-base/base.specifications";
import { UserEntity } from "../entities/user.entity";

export interface UserRepository {
  save(data: UserEntity): Promise<UserEntity>;
  findOne(
    spec: Specification<UserPersistenceEntity>,
  ): Promise<UserEntity | null>;
  find(spec: Specification<UserPersistenceEntity>): Promise<UserEntity[]>;
<<<<<<< Updated upstream
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
=======
  update(id: string, data: UserEntity): Promise<UserEntity | null>;
>>>>>>> Stashed changes
  delete(id: string): Promise<boolean>;
}
