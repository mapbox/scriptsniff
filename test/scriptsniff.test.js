'use strict';

const scriptsniff = require('../index.js');
const tape = require('tape');

tape('scriptsniff.getCategory', (assert) => {
  assert.deepEqual(scriptsniff.getCategory(36), '');
  assert.deepEqual(scriptsniff.getCategory(80), 'Basic Latin');
  assert.deepEqual(scriptsniff.getCategory(31200), 'CJK Unified Ideographs');

  // Scan all charcodes between 0-65535 and ensure they're assigned a category
  for (let i = 0; i < 65536; i++) {
    if (scriptsniff.getCategory(i) === null) {
      // Known gaps in the unicode ranges
      if (i >= 2144 && i <= 2207) continue;
      if (i >= 7296 && i <= 7359) continue;
      if (i >= 12256 && i <= 12271) continue;
      assert.fail(`No category found for charCode ${i}`);
    }
  }

  assert.end();
});


tape('scriptsniff.scripts', (assert) => {
  const all = {};
  for (let i = 0; i < 65536; i++) {
    const scripts = scriptsniff(String.fromCharCode(i));
    if (!scripts.length) continue;
    if (scripts.length > 1) assert.fail(`charCode ${i} produced more than 1 used script: ${scripts}`);
    all[scripts[0]] = true;
  }

  const scriptList = Object.keys(all).sort();
  if (process.env.UPDATE) {
    require('fs').writeFileSync(__dirname + '/../lib/scripts.json', JSON.stringify(scriptList, null, 2));
    assert.fail('Updated lib/scripts.json');
  } else {
    assert.deepEqual(scriptList, scriptsniff.scripts);
    assert.deepEqual(scriptList.length, 66);
  }
  assert.end();
});

tape('scriptsniff', (assert) => {
  assert.deepEqual(scriptsniff(''), []);
  assert.deepEqual(scriptsniff('1234'), []);
  assert.deepEqual(scriptsniff('Hello, World!'), ['Latin']);
  assert.deepEqual(scriptsniff('Hello, San José!'), ['Latin']);
  assert.deepEqual(scriptsniff('Hello, москва!'), ['Latin', 'Cyrillic']);
  assert.deepEqual(scriptsniff('Hello, москва!'), ['Latin', 'Cyrillic']);
  assert.deepEqual(scriptsniff('$1.00'), []);
  assert.deepEqual(scriptsniff('$1.00 for москва'), ['Latin', 'Cyrillic']);
  assert.deepEqual(scriptsniff('москва!'), ['Cyrillic']);
  assert.deepEqual(scriptsniff('京都市'), ['CJK']);
  assert.deepEqual(scriptsniff('中华 日本 한국'), ['CJK']);
  assert.end();
});

