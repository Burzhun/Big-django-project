FROM python:3.6.1

ENV PYTHONUNBUFFERED 1

RUN apt-get update &&  apt-get upgrade -y && apt-get install -y \
    libmagickwand-dev libpng-dev tzdata postgresql-client locales --no-install-recommends && \
    echo "Europe/Moscow" > /etc/timezone && rm -f /etc/localtime

ENV LANG=C.UTF-8


ADD ./django_dev/entrypoint.sh /entrypoint.sh
ADD project/requirements.txt /requirements.txt
WORKDIR /app

RUN pip3 install --no-cache-dir -Ur /requirements.txt