FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./

RUN [ "npm", "install" ]

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY  . .
EXPOSE 8080
# dev doesn't need to do a full build
CMD [ "npm", "run", "start" ]
