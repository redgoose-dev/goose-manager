FROM node:16.17.1-slim

WORKDIR /app
COPY . /app
RUN npm install
