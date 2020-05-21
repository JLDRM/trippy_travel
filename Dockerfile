FROM nginx:1.13.8

RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY src/. /opt/app