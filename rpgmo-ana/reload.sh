#!/bin/bash
curl -O https://data.mo.ee/release.js
echo "var item_base = [];" > items.js
cat release.js | tr -d '\n' | sed -e 's|;|;\n|g' | grep '^item_base\[[0-9]\+' >> items.js
echo "var npc_base = [];" > mobs.js
cat release.js | tr -d '\n' | sed -e 's|\(npc_base\[[0-9]\+\)|\n\1|g' | grep '^npc_base\[[0-9]*\]=createObject' | sed -e '$s|;.*|;|' -e 's|fn:{.*}},|fn:{}},|' >> mobs.js
