#!/bin/tcsh
curl -O https://data.mo.ee/release.js
echo "var npc_base = [];" > mobs.js
cat release.js | tr -d '\n' | sed -e 's|\(npc_base\[[^(]*createObject(\)|\n\1|g' | grep '^npc' | grep -v 'fn:{' | sed '$ s|;.*|;|' >> mobs.js
echo "var item_base = [];" > items.js
cat release.js | tr -d '\n' | sed -e 's|;|;\n|g' | grep '^item_base\[[0-9]\+' >> items.js
echo "var pets = [];" > pets.js
cat release.js | tr -d '\n' | sed -e 's|pets\[|\npets\[|g' | grep '^pets\[[0-9]*\]=createObject' | sed -e '$s|;.*|;|' >> pets.js
