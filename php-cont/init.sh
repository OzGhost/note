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
	-e MYSQL_ROOT_PASSWORD=nah \
	-e MYSQL_DATABASE=rock \
	--network mahnet \
	-p 3000:80 \
	mahphp:0.0.1

docker start mahdbs
docker cp mah.sql mahdbs:/tmp/mah.sql
echo "waiting on db start up ..."
sleep 75
docker exec mahdbs mysql -u root --password=Edo123 -D mahdb -e '\. /tmp/mah.sql'
docker start mahpo
