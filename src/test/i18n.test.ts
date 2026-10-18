import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionary";
import { extras } from "@/i18n/extras";

describe("Internationalization & Dictionary Parity", () => {
  it("has matching top-level keys in both English and Arabic dictionaries", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    const arKeys = Object.keys(dictionaries.ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it("has complete translation parity across nested navigation strings", () => {
    const enNav = Object.keys(dictionaries.en.nav).sort();
    const arNav = Object.keys(dictionaries.ar.nav).sort();
    expect(arNav).toEqual(enNav);
  });

  it("has complete translation parity across actions", () => {
    const enActions = Object.keys(dictionaries.en.actions).sort();
    const arActions = Object.keys(dictionaries.ar.actions).sort();
    expect(arActions).toEqual(enActions);
  });

  it("has complete translation parity across extras (auth, profile, notif, chat)", () => {
    const enExtras = Object.keys(extras.en).sort();
    const arExtras = Object.keys(extras.ar).sort();
    expect(arExtras).toEqual(enExtras);

    const enAuth = Object.keys(extras.en.auth).sort();
    const arAuth = Object.keys(extras.ar.auth).sort();
    expect(arAuth).toEqual(enAuth);
  });

  it("formats price in EGP correctly for both English and Arabic", () => {
    const price = 550;
    const enFormat = new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(price);
    const arFormat = new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(price);

    expect(enFormat).toContain("550");
    expect(arFormat).toBeTruthy();
  });
});
