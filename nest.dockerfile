FROM docker.io/library/node:17.6.0-alpine3.14
WORKDIR /usr/src/app
COPY ./node_modules ./node_modules
COPY ./packages/nest/node_modules ./node_modules
COPY ./packages/common ./node_modules/@rendezvous/common
COPY ./packages/nest/dist .
CMD ["node", "main.js"]
EXPOSE 80
EXPOSE 81