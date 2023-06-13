FROM node:20.3.0-slim

WORKDIR /app
COPY . /app
RUN npm install
