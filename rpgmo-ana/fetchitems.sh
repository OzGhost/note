#!/bin/bash
curl -O https://data.mo.ee/release.js
echo "var item_base = [];" > items.js
cat release.js | tr -d '\n' | sed -e 's|;|;\n|g' | grep '^item_base\[[0-9]\+' >> items.js
