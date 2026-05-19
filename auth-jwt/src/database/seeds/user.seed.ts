import { DataSource } from "typeorm";
import { UserPersistenceEntity } from "../../infrastructure/persistence/user-persistence.entity";

export async function seedUsers(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(UserPersistenceEntity);

  const count = await repo.count();
  if (count > 0) {
    console.log(`Database already has ${count} users, skipping seed.`);
    return;
  }

  const user = new UserPersistenceEntity();
  user.name = "Gabriel Godoi";
  user.email = "gabrielGodoi@email.com";
  user.password = "123@123";

  const saved = await repo.save(user);
  console.log(`Seeded users.`);
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
