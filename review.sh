#!/bin/sh -x

if [ ! -f "review.sh" ];then
    echo "Go to review.sh dir"
    exit 1
fi

case $1 in
    start)
        docker-compose -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME up --build -d
        chown -R www-data:www-data /work/data/mhealth_${CI_COMMIT_REF_NAME}/media
    ;;
    stop)
        docker-compose -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME down
        rm -rf /work/data/mhealth_$CI_COMMIT_REF_NAME/
	rm -rf data/*
    ;;
    proddb)
	docker-compose -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME restart postgres
	sleep 3
	echo 'DROP DATABASE IF EXISTS mhealth; CREATE DATABASE mhealth' | docker-compose -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME exec -T -u postgres postgres psql postgres
	/work/scripts/db_dump.sh mhealth | docker-compose -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME exec -T -u postgres  postgres psql mhealth
	docker-compose  -f docker-compose.review.yml -p mhealth$CI_COMMIT_REF_NAME restart
    ;;
esac
