'use strict';

const ranges = require('unicode-range-json');
const overrides = require('./lib/overrides.json');
const categories = require('./lib/categories.json');
const scripts = require('./lib/scripts.json');
const categoryMap = ranges.reduce((memo, item) => {
  if (item.category in categories) {
    memo[item.category] = categories[item.category];
  } else {
    memo[item.category] = item.category;
  }
  return memo;
}, { '': '' });

module.exports = scriptsniff;
module.exports.scripts = scripts;
module.exports.getCategory = getCategory;

function getCategory(charCode) {
  for (let a = 0; a < overrides.length; a++) {
    if (charCode >= overrides[a].range[0] && charCode <= overrides[a].range[1]) {
      return overrides[a].category;
    }
  }
  for (let b = 0; b < ranges.length; b++) {
    if (charCode >= ranges[b].range[0] && charCode <= ranges[b].range[1]) {
      return ranges[b].category;
    }
  }
}

function scriptsniff(text) {
  const used = {};
  for (let a = 0; a < text.length; a++) {
    const charCode = text.charCodeAt(a);
    const category = getCategory(charCode) || '';
    const script = categoryMap[category];
    if (script) used[script] = true;
  }
  return Object.keys(used);
}

