FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4490

CMD [ "node", "index.js" ]