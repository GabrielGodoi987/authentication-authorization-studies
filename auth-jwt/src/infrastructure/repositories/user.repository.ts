import { Repository } from "typeorm";
import { AppDataSource } from "../../database/source";
import { UserEntity } from "../../domain/entities/user.entity";
import { type UserRepository } from "../../domain/repositorie/user.repository";
import { type UserSpecification } from "../../domain/specifications/user.specifications";
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

  async save(data: Record<string, any>): Promise<UserEntity> {
    const repo = this.getRepo();
    const model = new UserPersistenceEntity();
    model.name = data.name;
    model.email = data.email;
    model.password = data.password;
    const saved = await repo.save(model);
    return this.mapper.toDomain(saved);
  }

  async findOne(spec: UserSpecification): Promise<UserEntity | null> {
    const model = await this.getRepo().findOneBy(spec.toWhere() as any);
    return model ? this.mapper.toDomain(model) : null;
  }

  async find(spec: UserSpecification): Promise<UserEntity[]> {
    const models = await this.getRepo().findBy(spec.toWhere() as any);
    return models.map((m) => this.mapper.toDomain(m));
  }

  async update(
    id: string,
    data: Record<string, any>,
  ): Promise<UserEntity | null> {
    const repo = this.getRepo();
    const model = await repo.findOneBy({ id } as any);
    if (!model) return null;

    if (data.name !== undefined) model.name = data.name;
    if (data.email !== undefined) model.email = data.email;
    if (data.password !== undefined) model.password = data.password;
    const saved = await repo.save(model);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getRepo().delete(id);
    return (result.affected ?? 0) > 0;
  }
}
