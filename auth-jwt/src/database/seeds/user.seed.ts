import { DataSource } from "typeorm";
import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";

export async function seedUsers(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(UserPersistenceEntity);

  const count = await repo.count();
  if (count > 0) {
    console.log(`Database already has ${count} users, skipping seed.`);
    return;
  }

  const gabriel = new UserPersistenceEntity();
  gabriel.name = "Gabriel Godoi";
  gabriel.email = "gabrielGodoi@email.com";
  gabriel.password = "Gabriel1";

  const users = Array.from({ length: 10 }).map((_, i) => {
    const entity = new UserPersistenceEntity();
    entity.name = `User ${i + 1}`;
    entity.email = `user${i + 1}@example.com`;
    entity.password = `Password${i + 1}1`;
    return entity;
  });

  users.push(gabriel);

  const saved = await repo.save(users);
  console.log(`Seeded ${saved.length} users.`);
}

if (process.argv[1]?.endsWith("user.seed.ts")) {
  (async () => {
    const { getDataSource } = await import("../source");
    const ds = await getDataSource().initialize();
    await seedUsers(ds);
    await ds.destroy();
  })().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}
