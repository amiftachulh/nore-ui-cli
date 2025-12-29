import { exec } from "child_process";
import fs, { access } from "fs/promises";
import path from "path";
import util from "util";
import { confirm } from "@inquirer/prompts";
import { Command } from "commander";
import z from "zod";
import { spinner } from "@/lib/spinner";
import { registryItemSchema, type Config, type RegistryItemFile } from "@/schemas";
import { kebabToCamel } from "@/utils/case-converter";
import { getConfig } from "@/utils/config";
import { getPackageInstaller } from "@/utils/get-package-manager";
import { resolveAliasPath } from "@/utils/resolve-alias-path";

const execAsync = util.promisify(exec);

export const addOptionsSchema = z.object({
  component: z.string(),
});

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument("<component>", "name of the component")
  .action(async (component) => {
    try {
      const options = addOptionsSchema.parse({ component });
      if (!options.component || options.component.length === 0) {
        console.error("Error: No components specified.");
        process.exit(1);
      }

      const config = await getConfig(process.cwd());
      if (!config) {
        console.error("Error: Could not load `nore-ui.json`.");
        process.exit(1);
      }

      spinner.start("Resolving component from registry...");
      const {
        files: filesMap,
        dependencies,
        devDependencies,
      } = await resolveRegistryItem(options.component);
      spinner.succeed("Component resolved.");

      const files = Array.from(filesMap.values());

      const tsPaths = await loadTsConfigPath(process.cwd());
      const { existingFiles, newFiles } = await classifyFiles(
        process.cwd(),
        config,
        tsPaths,
        files
      );

      let overwrite = false;
      if (existingFiles.length > 0) {
        overwrite = await confirm({
          message: `The following files already exist:\n${existingFiles.join("\n")}\nDo you want to overwrite them?`,
          default: false,
        });
      }

      spinner.start("Installing dependencies...");
      await installDependencies(Array.from(dependencies), Array.from(devDependencies));
      spinner.succeed("Dependencies installed.");

      spinner.start("Adding component files...");
      if (newFiles.length > 0 || overwrite) {
        for (const file of newFiles) {
          const content = transformImports(file.content ?? "", config);
          await fs.mkdir(path.dirname(file.absTarget), { recursive: true });
          await fs.writeFile(file.absTarget, content, "utf-8");

          if (file.type === "registry:recipe") {
            await updateRecipeIndex(path.join(process.cwd(), "preset", "recipes"), "recipe");
          }

          if (file.type === "registry:slot-recipe") {
            await updateRecipeIndex(
              path.join(process.cwd(), "preset", "slot-recipes"),
              "slot-recipe"
            );
          }
        }

        if (overwrite) {
          for (const filePath of existingFiles) {
            const original = files.find((f) =>
              filePath.endsWith(f.path.split("/").slice(3).join("/"))
            );
            if (!original) continue;

            const content = transformImports(original.content ?? "", config);
            await fs.writeFile(filePath, content, "utf-8");
          }
        }
      }

      spinner.succeed("Component files added.");
    } catch (error) {
      spinner.fail("Failed to add component.");
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

const REGISTRY_URL = process.env.NORE_UI_REGISTRY || "https://template-fe.nore.web.id";

async function fetchRegistryItem(name: string) {
  const res = await fetch(`${REGISTRY_URL}/r/${name}.json`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Registry item not found: ${name}`);
    }
    throw new Error(`Registry unavailable`);
  }
  return registryItemSchema.parse(await res.json());
}

interface ResolvedRegistry {
  files: Map<string, RegistryItemFile>;
  dependencies: Set<string>;
  devDependencies: Set<string>;
}

async function resolveRegistryItem(
  name: string,
  seen: Set<string> = new Set(),
  filesMap: Map<string, RegistryItemFile> = new Map()
): Promise<ResolvedRegistry> {
  if (seen.has(name)) {
    return {
      files: filesMap,
      dependencies: new Set(),
      devDependencies: new Set(),
    };
  }

  seen.add(name);

  const item = await fetchRegistryItem(name);

  const dependencies = new Set(item.dependencies || []);
  const devDependencies = new Set(item.devDependencies || []);

  for (const file of item.files ?? []) {
    if (!filesMap.has(file.path)) {
      filesMap.set(file.path, file);
    }
  }

  if (item.registryDependencies) {
    for (const dep of item.registryDependencies) {
      const resolved = await resolveRegistryItem(dep, seen, filesMap);
      resolved.dependencies.forEach((d) => dependencies.add(d));
      resolved.devDependencies.forEach((d) => devDependencies.add(d));
    }
  }

  return {
    files: filesMap,
    dependencies,
    devDependencies,
  };
}

type AliasConfig = {
  aliases: Record<string, string>;
};

async function loadTsConfigPath(cwd: string = process.cwd()): Promise<any> {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  const raw = await fs.readFile(tsconfigPath, "utf-8");
  const tsconfig = JSON.parse(raw);
  return tsconfig.compilerOptions?.paths ?? {};
}

async function resolveTargetPath(
  cwd: string,
  aliasConfig: AliasConfig,
  tsPaths: Record<string, string[]>,
  file: RegistryItemFile
) {
  const key = file.type.replace("registry:", "");

  if (key === "recipe") {
    const relPath = file.path.split("/").slice(3).join("/");
    return path.join(cwd, "preset/recipes", relPath.replace(/^recipes\//, ""));
  }

  if (key === "slot-recipe") {
    const relPath = file.path.split("/").slice(3).join("/");
    return path.join(cwd, "preset/slot-recipes", relPath.replace(/^slot-recipes\//, ""));
  }

  const alias = aliasConfig.aliases[key];
  if (!alias) return null;

  const targetBase = await resolveAliasPath(alias, tsPaths, cwd);
  const relPath = file.path.split("/").slice(3).join("/");

  return path.join(targetBase, relPath);
}

async function classifyFiles(
  cwd: string,
  aliasConfig: AliasConfig,
  tsPaths: Record<string, string[]>,
  files: RegistryItemFile[]
) {
  const existingFiles: string[] = [];
  const newFiles: { absTarget: string; content?: string; type: string }[] = [];

  for (const file of files) {
    const absTarget = await resolveTargetPath(cwd, aliasConfig, tsPaths, file);
    if (!absTarget) continue;

    try {
      await fs.access(absTarget);
      existingFiles.push(absTarget);
    } catch (error) {
      newFiles.push({ absTarget, content: file.content, type: file.type });
    }
  }

  return { existingFiles, newFiles };
}

async function installDependencies(deps: string[], devDeps: string[]) {
  const base = await getPackageInstaller(process.cwd());

  if (deps.length > 0) {
    const cmd = `${base} ${deps.join(" ")}`;
    await execAsync(cmd);
  }

  if (devDeps.length > 0) {
    const cmd = `${base} -D ${devDeps.join(" ")}`;
    await execAsync(cmd);
  }
}

function transformImports(content: string, cfg: Config): string {
  let result = content.replace(
    /from\s+["'](@\/registry\/default\/(ui|lib|hooks)\/[^"']+)["']/g,
    (_, full, group) => {
      const rest = full.replace(`@/registry/default/${group}/`, "");
      const alias = cfg.aliases[group as keyof typeof cfg.aliases];
      return `from "${alias}/${rest}"`;
    }
  );

  if (!cfg.rsc) {
    result = result.replace('"use client";\n\n', "");
  }

  return result;
}

async function updateRecipeIndex(baseDir: string, registryType: string) {
  const indexPath = path.join(baseDir, "index.ts");

  try {
    await access(indexPath);
  } catch (error) {
    await fs.writeFile(
      indexPath,
      registryType === "recipe"
        ? `export const recipes = {};\n`
        : `export const slotRecipes = {};\n`,
      "utf-8"
    );
  }

  const files = await fs.readdir(baseDir);
  const recipeFiles = files.filter((f) => f.endsWith(".ts") && f !== "index.ts");

  let imports = "";
  let exportsObj = "";

  for (const file of recipeFiles) {
    const base = path.basename(file, ".ts");
    const name = kebabToCamel(base);
    if (registryType === "recipe") {
      const importName = `${name}Recipe`;
      imports += `import { ${importName} } from "./${base}";\n`;
      exportsObj += `  ${name}: ${importName},\n`;
    } else {
      const importName = `${name}SlotRecipe`;
      imports += `import { ${importName} } from "./${base}";\n`;
      const exportsObjName = base === "switch" ? "switchRecipe" : name;
      exportsObj += `  ${exportsObjName}: ${importName},\n`;
    }
  }

  const content =
    imports +
    "\n" +
    (registryType === "recipe"
      ? `export const recipes = {\n${exportsObj}};\n`
      : `export const slotRecipes = {\n${exportsObj}};\n`);

  await fs.writeFile(indexPath, content, "utf-8");
}
