import { UserEntity } from "../../domain/entities/user.entity";
import { UserPersistenceEntity } from "../persistence/user-persistence.entity";

export class UserMapper {
  toDomain(persistence: UserPersistenceEntity): UserEntity {
    return UserEntity.fromPersistence(
      persistence.id,
      persistence.name,
      persistence.email,
      persistence.password,
    );
  }

  toPersistence(
    domain: Partial<
      Pick<UserEntity, "getId" | "getName" | "getEmail" | "getPassword">
    >,
  ): Partial<UserPersistenceEntity> {
    const data: Partial<UserPersistenceEntity> = {};

    if (domain.getId) data.id = domain.getId();
    if (domain.getName) data.name = domain.getName();
    if (domain.getEmail) data.email = domain.getEmail();
    if (domain.getPassword) data.password = domain.getPassword();

    return data;
  }
}
