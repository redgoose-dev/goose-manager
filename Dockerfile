FROM node:20.6.1-slim

WORKDIR /app
COPY . /app
RUN npm install
