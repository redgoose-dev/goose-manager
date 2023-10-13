FROM node:20.8.0-slim

WORKDIR /app
COPY . /app
RUN npm install
