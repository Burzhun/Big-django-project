#!/bin/sh

if [ ! -f "../data/mh_old.sql" ]; then
echo "
###########################################################
## You need to put mh_old.sql file into data directory. ##
###########################################################
"
exit 1
fi

docker exec -i mysql-mh  mysql -pHej2e1e5lk -e 'DROP DATABASE IF EXISTS mh_old; CREATE DATABASE mh_old;'
cat ../data/mh_old.sql | docker exec -i mysql-mh mysql -f -pHej2e1e5lk mh_old
