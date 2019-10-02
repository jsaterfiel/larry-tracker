FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./
COPY site ./

RUN yarn

EXPOSE 8282

CMD [ "node_modules/.bin/serve", "-s", "-l", "8282", "site" ]