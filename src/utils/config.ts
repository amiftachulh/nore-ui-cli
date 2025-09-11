import fs from "fs/promises";
import path from "path";
import { configSchema, type Config } from "@/schemas";

export async function getConfig(cwd: string = process.cwd()): Promise<Config | null> {
  const configPath = path.join(cwd, "nore-ui.json");

  try {
    const configFile = await fs.readFile(configPath, "utf-8");
    const rawConfig = JSON.parse(configFile);

    const config = configSchema.parse(rawConfig);
    return config;
  } catch (error) {
    return null;
  }
}
