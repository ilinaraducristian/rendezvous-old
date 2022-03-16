FROM docker.io/library/nginx:1.21.6-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
WORKDIR /www/data
COPY ./build .
EXPOSE 80