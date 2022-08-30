FROM node:16.17.0-slim

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 3000
