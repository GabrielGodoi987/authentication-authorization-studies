import { Repository } from "typeorm";
import { AppDataSource } from "../../database/source";
import { UserEntity } from "../../domain/entities/user.entity";
import { type UserRepository } from "../../domain/repositorie/user.repository";
import { Specification } from "../../lib/specifications-base/base.specifications";
import { UserMapper } from "../mappers/user.mapper";
import { UserPersistenceEntity } from "../persistence/user-persistence.entity";

export class UserRepositoryImpl implements UserRepository {
  private mapper: UserMapper;

  constructor() {
    this.mapper = new UserMapper();
  }

  private getRepo(): Repository<UserPersistenceEntity> {
    return AppDataSource.getRepository(UserPersistenceEntity);
  }

  async save(data: UserEntity): Promise<UserEntity> {
    const repo = this.getRepo();
    const model = this.mapper.toPersistence(data);
    const saved = await repo.save(model);
    return this.mapper.toDomain(saved);
  }

  async findOne(
    spec: Specification<UserPersistenceEntity>,
  ): Promise<UserEntity | null> {
    const model = await this.getRepo().findOneBy(spec.toWhere());
    return model ? this.mapper.toDomain(model) : null;
  }

  async find(
    spec: Specification<UserPersistenceEntity>,
  ): Promise<UserEntity[]> {
    const models = await this.getRepo().findBy(spec.toWhere() as any);
    return models.map((m) => this.mapper.toDomain(m));
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const repo = this.getRepo();
    const model = await repo.findOneBy({ id });

    if (!model) return null;

    const name = data.getName?.();
    const email = data.getEmail?.();
    const password = data.getPassword?.();

    if (name !== undefined) model.name = name;
    if (email !== undefined) model.email = email;
    if (password !== undefined) model.password = password;

    const saved = await repo.save(model);

    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }
}
