import path from "path";

export async function resolveAliasPath(
  alias: string,
  tsPaths?: Record<string, string[]>,
  cwd: string = process.cwd()
): Promise<string> {
  // Normalize alias (drop trailing /*)
  const aliasKey = alias.replace(/\/\*$/, "");

  if (tsPaths && tsPaths[aliasKey] && tsPaths[aliasKey][0]) {
    return path.join(cwd, tsPaths[aliasKey][0].replace(/\/\*$/, ""));
  }

  // Fallback: assume "@/lib" -> "src/lib"
  if (alias.startsWith("@/")) {
    return path.join(cwd, alias.replace("@/", "src/"));
  }

  return path.join(cwd, alias);
}
