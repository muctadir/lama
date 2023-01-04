# Why not use the image Python?
# It was elected to not use the Python image because Flask
# requires mysql-dev which is not installed in the Python image. 
# and cannot be installed as the python image lacks a package manager.
FROM ubuntu:22.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update \
    && apt-get install -y --no-install-recommends libmysqlclient-dev \
    python3-pip \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ADD .env /app

ADD ./backend/requirements.txt /app

RUN pip3 install -r requirements.txt

ADD ./backend/ /app/

EXPOSE 5000

HEALTHCHECK --interval=5s --timeout=3s CMD curl --fail http://localhost:5000/health || exit 

RUN chmod u+x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]