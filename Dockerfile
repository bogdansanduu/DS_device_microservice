# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
#COPY .env .env.development ./

# Expose the port on which the app will run (changed to 3000)
EXPOSE 3001

# Start the server using the production build
CMD ["npm", "run", "start:prod"]