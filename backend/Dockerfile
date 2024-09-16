# Use Node.js LTS version as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Run the application
CMD ["npm", "start"]