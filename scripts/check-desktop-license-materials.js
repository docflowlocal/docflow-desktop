#!/usr/bin/env node
"use strict";

// SPDX-License-Identifier: AGPL-3.0-or-later

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageJson.license !== "AGPL-3.0-or-later") {
  throw new Error("Desktop package must retain AGPL-3.0-or-later");
}
for (const relative of ["LICENSE", "LICENSES/MPL-2.0.txt", "NOTICE.md"]) {
  if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing ${relative}`);
}
for (const dependency of [
  "@docflow-local/contracts",
  "@docflow-local/core",
  "@docflow-local/license-verifier"
]) {
  const specifier = String(packageJson.dependencies?.[dependency] || "");
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(specifier)) {
    throw new Error(`${dependency} must use an exact published version`);
  }
}
process.stdout.write("DESKTOP_LICENSE_MATERIALS_OK\n");
