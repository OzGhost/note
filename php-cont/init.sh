#!/bin/bash
docker container rm -f mahpo >/dev/null 2>&1
docker container rm -f mahdbs >/dev/null 2>&1
docker network rm -f mahnet

docker network create mahnet
docker container create --name mahdbs \
	-e MYSQL_ROOT_PASSWORD=Edo123 \
	-e MYSQL_DATABASE=mahdb \
	--network mahnet \
	--network-alias mahdb \
	mysql:8.4.0
docker container create --name mahpo \
	--network mahnet \
	-p 3000:80 \
	mahphp:0.0.1

docker start mahdbs
docker cp mah.sql mahdbs:/docker-entrypoint-initdb.d/mah.sql
docker start mahpo
