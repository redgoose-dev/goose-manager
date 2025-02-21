ARG TAG=23.8.0-slim
FROM node:${TAG}
WORKDIR /app

# copy resource
COPY . /app

# install dependencies
RUN npm install --production

EXPOSE 80

# run entrypoint
RUN chmod +x /app/resource/docker-entrypoint.sh
ENTRYPOINT [ "resource/docker-entrypoint.sh" ]
