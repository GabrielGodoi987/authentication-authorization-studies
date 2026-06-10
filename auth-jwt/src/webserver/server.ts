import { app } from "../app";
import { MainSeeder } from "../database/seeds/main";

const PORT = process.env.PORT || 3000;
export async function main(): Promise<void> {
  await MainSeeder();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
