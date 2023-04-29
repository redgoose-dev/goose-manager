FROM node:20.0.0-slim

WORKDIR /app
COPY . /app
RUN npm install
