FROM node:8.9.1-slim

ADD dist/app.js /badger/app.js
ADD package.json /badger/package.json
ADD config.yml /badger/config.yml
ADD templates /badger/templates

RUN cd /badger && npm install

CMD cd badger && node /badger/app.js