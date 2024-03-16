FROM node:21.7.1-slim

WORKDIR /app
COPY . /app
RUN npm install
