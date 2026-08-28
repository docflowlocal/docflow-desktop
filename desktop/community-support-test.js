"use strict";

const assert = require("assert/strict");
const {
  COMMUNITY_SUPPORT_PREFERENCE_KEY,
  COMMUNITY_SUPPORT_URLS,
  communitySupportUrl,
  communitySupportState,
  isAllowedExternalUrl,
  withCommunitySupportDismissed
} = require("./community-support");

function main() {
  assert.equal(
    COMMUNITY_SUPPORT_URLS.en,
    "https://docflowlocal.com/support/?source=desktop&amount=29"
  );
  assert.equal(
    COMMUNITY_SUPPORT_URLS["zh-CN"],
    "https://docflowlocal.com/zh/support/?source=desktop&amount=199"
  );
  assert.equal(communitySupportUrl("zh-CN"), COMMUNITY_SUPPORT_URLS["zh-CN"]);
  assert.equal(communitySupportUrl("en"), COMMUNITY_SUPPORT_URLS.en);
  assert.equal(communitySupportUrl("unexpected"), COMMUNITY_SUPPORT_URLS.en);
  for (const url of [
    COMMUNITY_SUPPORT_URLS.en,
    COMMUNITY_SUPPORT_URLS["zh-CN"],
    "https://docflowlocal.com/pricing/",
    "https://docflowlocal.com/pricing/?source=desktop-trial"
  ]) {
    assert.equal(isAllowedExternalUrl(url), true, `${url} should be allowlisted`);
  }
  for (const url of [
    "http://docflowlocal.com/support/?source=desktop&amount=29",
    "https://evil.example/support/?source=desktop&amount=29",
    "https://docflowlocal.com.evil.example/support/?source=desktop&amount=29",
    "https://docflowlocal.com/support/?source=desktop&amount=99",
    "https://docflowlocal.com/support/?source=desktop&amount=29&customer=secret",
    "https://docflowlocal.com/support/?source=desktop&amount=29#fragment",
    "https://user@docflowlocal.com/support/?source=desktop&amount=29",
    "javascript:alert(1)"
  ]) {
    assert.equal(isAllowedExternalUrl(url), false, `${url} should be denied`);
  }

  const preferences = { locale: "zh-CN" };
  assert.deepEqual(communitySupportState(preferences), { dismissed: false });
  const dismissed = withCommunitySupportDismissed(
    preferences,
    () => new Date("2026-08-29T03:04:05.000Z")
  );
  assert.deepEqual(preferences, { locale: "zh-CN" }, "input preferences must not be mutated");
  assert.equal(dismissed.locale, "zh-CN");
  assert.equal(dismissed[COMMUNITY_SUPPORT_PREFERENCE_KEY], "2026-08-29T03:04:05.000Z");
  assert.deepEqual(communitySupportState(dismissed), { dismissed: true });

  const preserved = withCommunitySupportDismissed(
    dismissed,
    () => new Date("2026-09-01T00:00:00.000Z")
  );
  assert.equal(
    preserved[COMMUNITY_SUPPORT_PREFERENCE_KEY],
    "2026-08-29T03:04:05.000Z",
    "dismissal must remain one-way and stable"
  );
  assert.deepEqual(communitySupportState({ [COMMUNITY_SUPPORT_PREFERENCE_KEY]: "invalid" }), { dismissed: false });
  assert.equal(Object.keys(communitySupportState(dismissed)).includes("dismissedAt"), false);

  console.log("Community support preference and external URL tests passed");
}

main();
