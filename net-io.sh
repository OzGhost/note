#!/bin/bash
while true; do
    ip -s link | grep wlp -A 5 | tail -3 | grep -v TX | awk '{print $1}' | {
        read down
        read up
        echo -n "down: "
        echo "print( round( $down / (1024*1024) * 1000 ) / 1000)" | python -
        echo -n "  up: "
        echo "print( round( $up / (1024*1024) * 1000 ) / 1000)" | python -
    }
    sleep 10
done
