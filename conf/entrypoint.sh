#!/bin/sh
PGPASSWORD=$DB_PASSWORD

until pg_isready -h $DB_HOST; do
  echo "Waiting for database start"
  sleep 1
done

python3 manage.py migrate --noinput

/usr/bin/supervisord -n
