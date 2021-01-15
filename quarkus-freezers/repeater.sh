#!/bin/bash
for i in {1..1000}
do
    echo "seeding i $i"
    curl -L -w '\n%{http_code}\n' http://localhost:7002/consumer &
done;
