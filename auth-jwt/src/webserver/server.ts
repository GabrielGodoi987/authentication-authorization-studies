import { app } from "../app";
import { seedUsers } from "../database/seeds/user.seed";
import { AppDataSource } from "../database/source";

const PORT = process.env.PORT || 3000;
export async function main(): Promise<void> {
  const ds = await AppDataSource.initialize();
  await seedUsers(ds);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
