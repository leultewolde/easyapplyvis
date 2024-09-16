# Stage 1: Build the frontend
FROM node:18-alpine as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app using nginx
FROM nginx:alpine

# Copy the build output from the first stage to nginx's default directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]