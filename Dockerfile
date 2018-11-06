FROM node:11.1-alpine

RUN apk update && apk upgrade && apk add git

RUN git clone https://github.com/redgoose-dev/goose-manager.git

WORKDIR goose-manager

RUN npm install

ENV HOST 0.0.0.0
ENV PORT 3000

COPY .env /goose-manager
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]