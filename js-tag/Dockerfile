FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY  . .

RUN [ "yarn", "build" ]

EXPOSE 8080

# node_modules/.bin/serve -s -l 3000 build
CMD [ "node_modules/.bin/serve", "-s", "-l", "8080", "build" ]