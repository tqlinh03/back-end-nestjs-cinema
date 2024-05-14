FROM node:19-alpine

WORKDIR /cinema/backend

COPY package*.json ./

COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./

COPY . .

RUN apk add --no-cache make gcc g++ python3 && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3

RUN npm run build

CMD [ "npm","run", "start:prod" ]

