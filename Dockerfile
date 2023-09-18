FROM node:20.6.1-slim
#FROM oven/bun:latest

WORKDIR /app
COPY . /app
RUN npm install
