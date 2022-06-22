# By @BHenkemans
# Stage 
FROM ubuntu:22.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    certbot \
    python3-certbot-nginx \
    micro

COPY default /etc/nginx/sites-enabled/default

COPY default /etc/nginx/sites-available/default

EXPOSE 80

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
