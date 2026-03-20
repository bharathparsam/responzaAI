# Use official Node.js image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD [ "node", "src/index.js" ]
