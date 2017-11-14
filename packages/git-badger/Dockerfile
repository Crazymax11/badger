FROM node:8.9.1-alpine

ADD ./dist/app.js /badger/app.js
ADD package.json /badger/package.json
ADD config.yml /badger/config.yml

RUN cd /badger && npm install

CMD node /badger/app.js