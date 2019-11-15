FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY . .

RUN [ "npm", "install" ]

RUN [ "npm", "run-script", "build" ]

EXPOSE 8383

CMD [ "./node_modules/.bin/nodemon", "--watch", "src"]