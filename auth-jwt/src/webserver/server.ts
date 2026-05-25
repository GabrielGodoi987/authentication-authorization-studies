import { app } from "../app";
import { MainSeeder } from "../database/seeds/main";
import { AppDataSource } from "../database/source";

const PORT = process.env.PORT || 3000;
export async function main(): Promise<void> {
  const ds = await AppDataSource.initialize();
  await MainSeeder();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
