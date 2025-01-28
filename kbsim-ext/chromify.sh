#!/bin/bash
jqc="/Users/oz/zone/bin/jq"
if [ ! -f manifest.json ] || [ ! -f ground.js ] || [ ! -f cfg.js ]
then
	echo "__[xx] One or more file is missing! [ manifest.json | ground.js | cfg.js ]"
	exit 1
fi
cat manifest.json | $jqc ".manifest_version = 3 | del(.permissions[0]) | del(.browser_specific_settings)" > mani.json
cat ground.js | sed 's|browser\.storage|chrome.storage|g' > g2.js
cat cfg.js | sed 's|browser\.storage|chrome.storage|g' > c2.js
mv mani.json manifest.json
mv g2.js ground.js
mv c2.js cfg.js
