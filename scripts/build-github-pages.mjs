import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const preview = mkdtempSync(join(tmpdir(), "bati-pool-pages-"));
const files = [
  "app", "components", "db", "hooks", "lib", "public", "vendor",
  "package.json", "postcss.config.mjs", "tsconfig.json",
];

for (const file of files) {
  cpSync(join(root, file), join(preview, file), {
    recursive: true,
    filter: (source) => !/^app\/(api|admin)(\/|$)|^app\/(robots|sitemap)\.ts$/.test(relative(root, source)),
  });
}
mkdirSync(join(preview, "app/admin"), { recursive: true });
cpSync(join(root, "scripts/admin-preview-page.tsx"), join(preview, "app/admin/page.tsx"));
symlinkSync(join(root, "node_modules"), join(preview, "node_modules"), "dir");

writeFileSync(join(preview, "next.config.ts"), `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/bati-pool-preview",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
`);

for (const file of ["app/page.tsx", "app/[slug]/page.tsx"]) {
  const path = join(preview, file);
  const source = readFileSync(path, "utf8");
  const updated = source.replace('export const dynamic = "force-dynamic";', "");
  if (updated === source) throw new Error(`Expected dynamic route declaration in ${file}`);
  writeFileSync(path, updated);
}

const result = spawnSync(join(root, "node_modules/.bin/next"), ["build", "--webpack"], {
  cwd: preview,
  env: {
    ...process.env,
    NEXT_PUBLIC_PREVIEW_MODE: "1",
    NEXT_PUBLIC_BASE_PATH: "/bati-pool-preview",
    SITE_PUBLIC_URL: "https://jyboii.github.io/bati-pool-preview",
    DB_HOST: "",
    DB_USER: "",
    DB_PASSWORD: "",
    DB_NAME: "",
  },
  stdio: "inherit",
});

if (result.status !== 0) process.exit(result.status || 1);
const output = join(preview, "out");
if (!existsSync(join(output, "index.html"))) throw new Error("Missing static homepage");
if (process.argv.includes("--publish")) {
  for (const entry of readdirSync(output)) {
    cpSync(join(output, entry), join(root, entry), { recursive: true, force: true });
  }
  console.log("GitHub Pages files updated in the repository root.");
} else {
  console.log(`Static preview: ${output}`);
}
