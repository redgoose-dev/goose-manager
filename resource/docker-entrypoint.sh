#!/bin/bash

# build
npm install
npm run build
rm -rf ./node_modules
rm ./package-lock.json

# for production
npm install --production

# run server
npm run start
