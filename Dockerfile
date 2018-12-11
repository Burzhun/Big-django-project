FROM ubuntu:16.04
EXPOSE 80
RUN apt-get update &&  apt-get upgrade -y && apt-get install -y \
    git python3 python3-dev python3-setuptools python3-pip libpq-dev build-essential libmagickwand-dev libpng-dev tzdata nginx supervisor postgresql-client libmysqlclient-dev cron --no-install-recommends && \
    echo "Europe/Moscow" > /etc/timezone && rm -f /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV LANG=C.UTF-8
RUN pip3 install --no-cache-dir -U pip setuptools uwsgi psycopg2
WORKDIR /app
ADD ./project/requirements.txt /app/
RUN pip3 install --no-cache-dir -Ur requirements.txt
ADD ./project /app
RUN python3 manage.py collectstatic --settings mhealth.settings.before_settings --noinput
RUN chown -R www-data:www-data /app/
ADD ./conf/entrypoint.sh /entrypoint.sh
ADD ./conf/supervisor/ /etc/supervisor/conf.d/
ADD ./conf/uwsgi /etc/uwsgi
ADD ./conf/nginx /etc/nginx
ENTRYPOINT /entrypoint.sh
