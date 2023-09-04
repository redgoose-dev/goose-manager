FROM node:20.5.1-slim

WORKDIR /app
COPY . /app
RUN npm install
