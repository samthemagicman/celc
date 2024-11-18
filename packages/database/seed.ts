import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./src";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
(async () => {
  const seedFileContents = fs.readFileSync(
    path.join(__dirname, "seed.sql"),
    "utf-8",
  );
  console.log("Seeding database...");
  const commands = seedFileContents.split(";");

  for (const command of commands) {
    if (!command) {
      continue;
    }
    await db.run(command + ";");
  }

  console.log("Database seeded!");
})();
