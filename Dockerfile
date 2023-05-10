FROM node:20.1.0-slim

WORKDIR /app
COPY . /app
RUN npm install
