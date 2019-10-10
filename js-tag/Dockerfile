FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./
COPY gulpfile.js ./

RUN [ "npm", "install" ]

COPY src ./

RUN [ "./node_modules/.bin/gulp", "js-compile" ]

EXPOSE 8383

CMD [ "node_modules/.bin/serve", "-s", "-l", "8383", "dist" ]