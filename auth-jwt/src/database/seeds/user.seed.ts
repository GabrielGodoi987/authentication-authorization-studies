import bcrypt from "bcrypt";
import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";
import { getDataSource } from "../source";

export async function seedUsers(): Promise<{
  message: string;
  users?: { id: string; email: string }[];
}> {
  try {
    const dataSource = getDataSource();
    const repo = dataSource.getRepository(UserPersistenceEntity);

    const count = await repo.count();
    if (count > 0) {
      console.log(`Database already has ${count} users, skipping seed.`);
      return {
        message: `Database already has ${count} users, skipping seed.`,
      };
    }

    const gabriel = new UserPersistenceEntity();
    gabriel.name = "Gabriel Godoi";
    gabriel.email = "gabrielGodoi@email.com";
    gabriel.password = bcrypt.hashSync("Gabriel1", 10);

    const users = Array.from({ length: 10 }).map((_, i) => {
      const entity = new UserPersistenceEntity();
      entity.name = `User ${i + 1}`;
      entity.email = `user${i + 1}@example.com`;
      entity.password = bcrypt.hashSync(`Password$123`, 10);
      return entity;
    });

    users.push(gabriel);

    const saved = await repo.save(users);

    return {
      message: `🌱 Seeded ${saved.length} users successfully`,
      users: saved.map((u) => ({ id: u.id, email: u.email })),
    };
  } catch (error: any) {
    console.error("Error seeding users:", error);
    return {
      message: `❌ Failed to seed users: ${error.message}`,
    };
  }
}
