FROM node:12

WORKDIR /usr/first_app/server/src/app

COPY package*.json ./

RUN npm install

COPY dist/ dist/

EXPOSE 5000

CMD [ "npm", "start" ]