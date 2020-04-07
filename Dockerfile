FROM node:13.12-alpine

RUN apk update && apk upgrade && apk add git && apk add nano

RUN git clone https://github.com/redgoose-dev/goose-manager.git

WORKDIR goose-manager

RUN npm install

ENV NODE_ENV=production

RUN npm run setup
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]
