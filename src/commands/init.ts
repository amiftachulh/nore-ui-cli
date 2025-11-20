import fs from "fs/promises";
import { confirm, input } from "@inquirer/prompts";
import { Command } from "commander";
import { cssVars } from "@/utils/css";
import { STRUCTURE } from "@/utils/structure";

const DEFAULT_UI_ALIAS = "@/components/ui";
const DEFAULT_LIB_ALIAS = "@/lib";
const DEFAULT_HOOKS_ALIAS = "@/hooks";

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .action(async () => {
    // Check if panda.config.ts doesn't exist
    try {
      await fs.access("panda.config.ts");
    } catch (error) {
      console.error("Error: panda.config.ts does not exist. Please install Panda CSS first.");
      console.log("Documentation: https://panda-css.com/docs/overview/getting-started");
      process.exit(1);
    }

    // Check nore-ui.json if exists
    try {
      await fs.access("nore-ui.json");

      const overwrite = await confirm({
        message: "nore-ui.json already exists. Do you want to overwrite it?",
      });

      if (!overwrite) {
        console.log("Operation cancelled. No files were modified.");
        process.exit(0);
      }
    } catch {
      // nore-ui.json does not exist, continue
    }

    // CSS file path
    const cssPath = await input({
      message: "Your css file path (relative to project root):",
      default: "src/styles.css",
    });

    try {
      await fs.access(cssPath);
    } catch (error) {
      console.error(`Error: "${cssPath}" does not exist.`);
      process.exit(1);
    }

    // React Server Component
    const isRSC = await confirm({
      message: "Are you using React Server Components in your project?",
      default: false,
    });

    const aliases = {
      ui: await input({
        message: "Configure the import alias for ui components:",
        default: DEFAULT_UI_ALIAS,
      }),
      lib: await input({
        message: "Configure the import alias for utility functions:",
        default: DEFAULT_LIB_ALIAS,
      }),
      hooks: await input({
        message: "Configure the import alias for hooks:",
        default: DEFAULT_HOOKS_ALIAS,
      }),
    };

    const config = {
      aliases,
      css: cssPath,
      rsc: isRSC,
    };

    await fs.writeFile("nore-ui.json", JSON.stringify(config, null, 2));

    // Modify panda.config.ts
    try {
      await patchPandaConfig();
    } catch (error) {
      console.log("⚠ panda.config.ts couldn't be updated");
      console.error(error);
    }

    // Write CSS file
    let cssContentToAppend = cssVars;
    const existingCss = await fs.readFile(cssPath, "utf-8");
    if (!existingCss.endsWith("\n")) {
      cssContentToAppend = "\n" + cssVars;
    }
    await fs.appendFile(cssPath, cssContentToAppend, "utf-8");

    // Add template folder and files
    Object.entries(STRUCTURE).forEach(async ([path, content]) => {
      await fs.mkdir(path.split("/").slice(0, -1).join("/"), { recursive: true });
      await fs.writeFile(path, content);
    });

    console.log("Project initialized. You can now add components.");
  });

async function patchPandaConfig() {
  let content = await fs.readFile("panda.config.ts", "utf-8");

  // Ensure import only once
  if (!content.includes(`import preset from "./preset"`)) {
    content = `import preset from "./preset";\n` + content;
  }

  // Normalize preflight: ensure it's true
  if (content.match(/preflight:\s*false/)) {
    content = content.replace(/preflight:\s*false/, "preflight: true");
  } else if (!content.match(/preflight:\s*true/)) {
    // if preflight doesn't exist at all, add it
    content = content.replace(/(theme:\s*{)/, `$1\n  preflight: true,`);
  }

  // Ensure properties exist with correct values, placed after preflight
  content = content.replace(/(preflight:\s*true,?)/, (match) => {
    let insert = "\n";

    // presets
    if (content.match(/presets:\s*\[.*\]/)) {
      content = content.replace(/presets:\s*\[.*\]/, "presets: [preset]");
    } else {
      insert += `  presets: [preset],\n`;
    }

    if (content.match(/jsxFramework:\s*["'][^"']+["']/)) {
      content = content.replace(/jsxFramework:\s*["'][^"']+["']/, 'jsxFramework: "react"');
    } else {
      insert += `  jsxFramework: "react",\n`;
    }

    if (content.match(/jsxStyleProps:\s*["'][^"']+["']/)) {
      content = content.replace(/jsxStyleProps:\s*["'][^"']+["']/, 'jsxStyleProps: "minimal"');
    } else {
      insert += `  jsxStyleProps: "minimal",\n`;
    }

    return match + insert;
  });

  await fs.writeFile("panda.config.ts", content);
}
