#!/bin/sh
set -e
cmd="$@"

PGPASSWORD=$DB_PASSWORD

until pg_isready -h $DB_HOST; do
  echo "Waiting for database start"
  sleep 1
done


python3 manage.py makemigrations --merge --noinput
python3 manage.py migrate
# python3 manage.py loaddata app.json




exec $cmd
python3 manage.py runserver 0.0.0.0:80
