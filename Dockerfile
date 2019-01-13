FROM node:10-jessie-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# default port
EXPOSE 5000

CMD ["npm", "start"]