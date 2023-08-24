FROM node:20.5.0-slim

WORKDIR /app
COPY . /app
RUN npm install
