import assert from "node:assert/strict";
import test from "node:test";

import {
  FEMALE_FIRST_NAME_SEEDS,
  findNameSeedBuckets,
  getNameSeedBucket,
  MALE_FIRST_NAME_SEEDS,
  NAME_SEED_BUCKET_LABELS,
  NAME_SEED_VOCABULARY,
  SURNAME_SEEDS,
  UNISEX_FIRST_NAME_SEEDS,
  type NameSeedBucket,
} from "../../data/nameSeedVocabulary";

const expectedBuckets: readonly NameSeedBucket[] = [
  "maleFirstNames",
  "femaleFirstNames",
  "unisexFirstNames",
  "surnames",
];

function assertSortedUnique(values: readonly string[]) {
  assert.equal(new Set(values).size, values.length);
  assert.deepEqual(
    [...values],
    [...values].sort((a, b) => a.localeCompare(b)),
  );
}

test("splits name seed vocabulary into first-name and surname buckets", () => {
  assert.equal(MALE_FIRST_NAME_SEEDS.length, 754);
  assert.equal(FEMALE_FIRST_NAME_SEEDS.length, 726);
  assert.equal(UNISEX_FIRST_NAME_SEEDS.length, 190);
  assert.equal(SURNAME_SEEDS.length, 980);

  assert.deepEqual(Object.keys(NAME_SEED_VOCABULARY).sort(), [...expectedBuckets].sort());
  assert.equal(NAME_SEED_BUCKET_LABELS.maleFirstNames, "Male first names");
  assert.equal(NAME_SEED_BUCKET_LABELS.femaleFirstNames, "Female first names");
  assert.equal(NAME_SEED_BUCKET_LABELS.unisexFirstNames, "Unisex first names");
  assert.equal(NAME_SEED_BUCKET_LABELS.surnames, "Surnames");
});

test("keeps name seed buckets sorted and unique for stable combo inputs", () => {
  for (const bucket of expectedBuckets) {
    assertSortedUnique(getNameSeedBucket(bucket));
  }
});

test("finds known names in their intended seed buckets", () => {
  assert.deepEqual(findNameSeedBuckets("Magnus"), ["maleFirstNames"]);
  assert.deepEqual(findNameSeedBuckets("Megan"), ["femaleFirstNames"]);
  assert.deepEqual(findNameSeedBuckets("Wren"), ["unisexFirstNames"]);
  assert.deepEqual(findNameSeedBuckets("Smith"), ["surnames"]);
});

test("normalizes lookup whitespace and case without inventing missing names", () => {
  assert.deepEqual(findNameSeedBuckets("  o'connor  "), ["surnames"]);
  assert.deepEqual(findNameSeedBuckets(""), []);
  assert.deepEqual(findNameSeedBuckets("NotASeedName"), []);
});
