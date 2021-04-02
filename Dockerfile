FROM node

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

RUN npm install

# To run it in production we have to use
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "start", "index.js" ]
