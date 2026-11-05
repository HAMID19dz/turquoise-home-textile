import { describe, it, expect } from 'vitest';
import ar from '../src/i18n/ar.json';
import fr from '../src/i18n/fr.json';
import en from '../src/i18n/en.json';

function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value as Record<string, unknown>, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys.sort();
}

describe('i18n Translation Parity', () => {
  const arKeys = getAllKeys(ar);
  const frKeys = getAllKeys(fr);
  const enKeys = getAllKeys(en);

  it('all languages have exact key parity with Arabic', () => {
    const missingInFr = arKeys.filter((k) => !frKeys.includes(k));
    const missingInEn = arKeys.filter((k) => !enKeys.includes(k));
    const extraInFr = frKeys.filter((k) => !arKeys.includes(k));
    const extraInEn = enKeys.filter((k) => !arKeys.includes(k));

    expect(missingInFr, `Missing in French: ${missingInFr.join(', ')}`).toEqual([]);
    expect(missingInEn, `Missing in English: ${missingInEn.join(', ')}`).toEqual([]);
    expect(extraInFr, `Extra in French: ${extraInFr.join(', ')}`).toEqual([]);
    expect(extraInEn, `Extra in English: ${extraInEn.join(', ')}`).toEqual([]);
  });

  it('no translation value is empty', () => {
    function assertNoEmptyValues(dict: Record<string, unknown>, lang: string) {
      const keys = getAllKeys(dict);
      for (const k of keys) {
        const parts = k.split('.');
        let val: unknown = dict;
        for (const p of parts) {
          val = (val as Record<string, unknown>)[p];
        }
        expect(typeof val === 'string' && val.trim().length > 0, `${lang} key "${k}" is empty`).toBe(true);
      }
    }

    assertNoEmptyValues(ar, 'Arabic');
    assertNoEmptyValues(fr, 'French');
    assertNoEmptyValues(en, 'English');
  });
});
