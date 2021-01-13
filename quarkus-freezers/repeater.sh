#!/bin/bash
for i in {1..100}
do
    echo "seeding i $i"
    curl -L -w '\n%{http_code}\n' http://localhost:7002/consumer &
done;
