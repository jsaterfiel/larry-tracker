FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./

RUN [ "npm", "install" ]

RUN [ "npm", "run", "build" ]

EXPOSE 8383

CMD [ "node_modules/.bin/serve", "-s", "-l", "8383", "build" ]