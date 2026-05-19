import { UserEntity } from "../entities/user.entity";
import { UserSpecification } from "../specifications/user.specifications";

export interface UserRepository {
  save(data: Record<string, any>): Promise<UserEntity>;
  findOne(spec: UserSpecification): Promise<UserEntity | null>;
  find(spec: UserSpecification): Promise<UserEntity[]>;
  update(id: string, data: Record<string, any>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
