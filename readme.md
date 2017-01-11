scriptsniff
-----------
Detect scripts used in a string based on unicode character ranges (and supplementary logic).

- Categorizes unicode ranges between 0-65535 as one of [66 scripts](https://github.com/mapbox/scriptsniff/blob/master/lib/scripts.json).
- Considers punctuation, numerals, currency symbols, and other unicode ranges script-agnostic.
- Treats all Latin ranges as a single script ("Latin").
- Treats all CJK ranges as a single script ("CJK").

### Usage

```js
const scriptsniff = require('scriptsniff');

scriptsniff('There is a $1.00 fine for parking here.');
// [ 'Latin' ]

scriptsniff('Please pay $1,000 ransom to the ヤクザ in Москва.');
// [ 'Latin', 'CJK', 'Cyrillic' ]

scriptsniff('#123-456-7890');
// []
```

