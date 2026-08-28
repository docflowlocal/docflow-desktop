"use strict";

const COMMUNITY_SUPPORT_URLS = Object.freeze({
  "zh-CN": "https://docflowlocal.com/zh/support/?source=desktop&amount=199",
  en: "https://docflowlocal.com/support/?source=desktop&amount=29"
});
const COMMUNITY_SUPPORT_PREFERENCE_KEY = "communitySupportPromptDismissedAt";

const ALLOWED_EXTERNAL_URLS = new Set([
  "https://docflowlocal.com/pricing/",
  "https://docflowlocal.com/pricing/?source=desktop-trial",
  ...Object.values(COMMUNITY_SUPPORT_URLS)
]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isAllowedExternalUrl(value) {
  if (typeof value !== "string" || value.length > 512) return false;
  try {
    const parsed = new URL(value);
    if (
      parsed.protocol !== "https:"
      || parsed.username
      || parsed.password
      || parsed.hash
    ) return false;
    return ALLOWED_EXTERNAL_URLS.has(parsed.href);
  } catch (_error) {
    return false;
  }
}

function communitySupportUrl(locale) {
  return locale === "zh-CN" ? COMMUNITY_SUPPORT_URLS["zh-CN"] : COMMUNITY_SUPPORT_URLS.en;
}

function communitySupportState(preferences) {
  if (!isPlainObject(preferences)) return Object.freeze({ dismissed: false });
  const dismissedAt = preferences[COMMUNITY_SUPPORT_PREFERENCE_KEY];
  return Object.freeze({
    dismissed: typeof dismissedAt === "string" && Number.isFinite(Date.parse(dismissedAt))
  });
}

function withCommunitySupportDismissed(preferences, now = () => new Date()) {
  const source = isPlainObject(preferences) ? preferences : {};
  const existing = communitySupportState(source);
  if (existing.dismissed) return { ...source };
  const value = now();
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError("now returned an invalid timestamp");
  return {
    ...source,
    [COMMUNITY_SUPPORT_PREFERENCE_KEY]: date.toISOString()
  };
}

module.exports = Object.freeze({
  COMMUNITY_SUPPORT_PREFERENCE_KEY,
  COMMUNITY_SUPPORT_URLS,
  communitySupportUrl,
  communitySupportState,
  isAllowedExternalUrl,
  withCommunitySupportDismissed
});
