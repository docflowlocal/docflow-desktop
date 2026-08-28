"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const SUPPORTED_LOCALES = ["zh-CN", "en"];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function loadCatalog() {
  const context = { window: {} };
  vm.runInNewContext(read("static/i18n.js"), context, {
    filename: "static/i18n.js"
  });
  return context.window.DOCFLOW_I18N;
}

function referencedTranslationKeys() {
  const html = read("static/index.html");
  const appSource = read("static/app.js");
  const keys = new Set();

  for (const match of html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)) {
    keys.add(match[1]);
  }
  for (const match of appSource.matchAll(/\bt\(\s*["']([^"']+)["']/g)) {
    keys.add(match[1]);
  }
  return keys;
}

function assertSameMembers(actual, expected, label) {
  assert.deepEqual(
    [...new Set(actual)].sort(),
    [...new Set(expected)].sort(),
    label
  );
}

function main() {
  const catalog = loadCatalog();
  assert(catalog && typeof catalog === "object", "Translation catalog was not loaded");
  assertSameMembers(Object.keys(catalog), SUPPORTED_LOCALES, "Supported UI locales changed unexpectedly");

  const chineseKeys = Object.keys(catalog["zh-CN"]);
  const englishKeys = Object.keys(catalog.en);
  assertSameMembers(chineseKeys, englishKeys, "Chinese and English catalogs must expose identical keys");
  assert(chineseKeys.length >= 350, "Translation catalog is unexpectedly incomplete");

  for (const locale of SUPPORTED_LOCALES) {
    for (const [key, value] of Object.entries(catalog[locale])) {
      assert.equal(typeof value, "string", `${locale}:${key} must be a string`);
      assert(value.trim(), `${locale}:${key} must not be blank`);
    }
  }

  for (const key of referencedTranslationKeys()) {
    for (const locale of SUPPORTED_LOCALES) {
      assert(Object.hasOwn(catalog[locale], key), `Missing ${locale} translation for ${key}`);
    }
  }

  assert.match(catalog["zh-CN"]["app.title"], /[\u3400-\u9fff]/, "Chinese application title is missing");
  assert.match(catalog.en["app.title"], /Document Automation/i, "English application title is missing");
  assert.match(catalog["zh-CN"]["language.switch"], /英文/, "Chinese language-switch label is missing");
  assert.match(catalog.en["language.switch"], /Chinese/i, "English language-switch label is missing");

  const html = read("static/index.html");
  const appSource = read("static/app.js");
  assert.match(html, /id="languageToggle"/, "Language switch is missing from the main toolbar");
  assert.match(appSource, /const SUPPORTED_LOCALES = \["zh-CN", "en"\]/, "Renderer locale allowlist is incomplete");
  assert.match(appSource, /localStorage\.setItem\("docflow-locale", locale\)/, "Renderer locale persistence is missing");
  assert.match(appSource, /window\.docflowDesktop\.setLocale\(locale\)/, "Desktop locale persistence is missing");
  assert.match(appSource, /await window\.docflowDesktop\.setLocale\(state\.locale\)/, "First-run system locale is not synchronized to desktop preferences");

  const build = require("../package.json").build;
  assertSameMembers(build.mac.electronLanguages, ["en", "zh_CN"], "Packaged macOS locales must be English and Simplified Chinese");
  assertSameMembers(build.win.electronLanguages, ["en-US", "zh-CN"], "Packaged Windows locales must be English and Simplified Chinese");
  assert.equal(build.mac.extendInfo.CFBundleDevelopmentRegion, "en");
  assertSameMembers(
    build.mac.extendInfo.CFBundleLocalizations,
    ["en", "zh_CN"],
    "macOS bundle localizations must declare English and Simplified Chinese"
  );
  assert.equal(build.nsis.multiLanguageInstaller, true, "Windows installer must be multilingual");
  assertSameMembers(
    build.nsis.installerLanguages,
    ["en_US", "zh_CN"],
    "Windows installer languages must be English and Simplified Chinese"
  );
  assert.equal(build.nsis.displayLanguageSelector, true, "Windows installer language selector must be visible");

  const macRelease = require("./electron-builder.release.cjs");
  const windowsRelease = require("./electron-builder.win-release.cjs");
  assertSameMembers(macRelease.mac.electronLanguages, build.mac.electronLanguages, "macOS release config dropped packaged locales");
  assertSameMembers(windowsRelease.win.electronLanguages, build.win.electronLanguages, "Windows release config dropped packaged locales");
  assertSameMembers(windowsRelease.nsis.installerLanguages, build.nsis.installerLanguages, "Windows release config dropped installer languages");
  assert.equal(windowsRelease.nsis.displayLanguageSelector, true, "Windows release config hid the language selector");

  process.stdout.write(`DocFlow bilingual UI and installer contract passed (${chineseKeys.length} keys).\n`);
}

main();
