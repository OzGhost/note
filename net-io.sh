#!/bin/bash
while true; do
    ip -s link | grep wlp -A 5 | tail -3 | grep -v TX | awk '{print $1}' | {
        read down
        read up
        ld=${#down}
        lu=${#up}
        nd=0
        nu=0
        if [ $ld -gt 5 ]; then
            t=$((ld-5))
            nd=$(echo ${down:0:$t} | sed 's|\(.\)$|.\1|')
        fi
        if [ $lu -gt 5 ]; then
            t=$((lu-5))
            nu=$(echo ${up:0:$t} | sed 's|\(.\)$|.\1|')
        fi
        printf "\n> down: $nd | up: $nu "
    }
    sleep 10
done
